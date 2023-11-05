// This page is going to be used for viewing all users and adding them to your friends list.
// This is probably a temporary measure, Right now it is just to make sure I have the drizzleORM logic setup properly.
// Ultimately there should be a separate friends viewing page and friends search page.

import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { userFriends, users } from "db/schema";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

// loader for getting all users, such that they can be added to the friends table
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allUsers = await db.select().from(users);

  const allFriends = await db.query.userFriends.findMany({
    where: eq(userFriends.userId, session.id),
    with: {
      friendId: {
        with: {
          friends: true,
        },
      },
    },
  });

  console.log(allFriends);

  return json({ session, allUsers, allFriends });
};

// action for saving a user to the current user's friend list
export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const userId = form.get("userId");
  const friendId = form.get("friendId");

  invariant(userId, "User ID required.");
  invariant(friendId, "Friend ID required.");

  const newFriend = await db.insert(userFriends).values({
    userId: Number(userId),
    friendId: Number(friendId),
  });

  console.log(newFriend);
  return json({ newFriend });
};

export default function FriendsPage() {
  const { session, allUsers, allFriends } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto w-4/5">
      <div className="grid grid-cols-5">
        <div className="col-span-1">
          {allFriends.map((friend) => (
            <div key={friend.friendId}>{friend.friendId.fullName}</div>
          ))}
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-3">
          {allUsers.map((user) => (
            <div
              key={user.id}
              className="w-lg relative flex flex-col gap-1 border p-3 hover:bg-slate-100"
            >
              <p>{user.userName}</p>
              <p>{user.fullName}</p>
              <p>{user.email}</p>
              <form action="" method="POST" className="absolute right-3 top-3">
                <input type="hidden" value={session.id} name="userId" />
                <input type="hidden" value={user.id} name="friendId" />
                <button className="border border-red-600 p-1 hover:bg-red-100">
                  Add Friend
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
