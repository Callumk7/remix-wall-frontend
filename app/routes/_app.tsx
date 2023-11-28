import { auth } from "@/features/auth/helper";
import { Navigation } from "@/features/navigation/components/Navigation";
import { Sidebar } from "@/features/navigation/components/Sidebar";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { UserWithProfile, pages, posts, users } from "db/schema";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // we want to get both the user profile (for the user controls),
  // and the friends list (for the sidebar). We can do that in a 
  // single request:
  const userData = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    with: {
      friends: {
        with: {
          friend: {
            with: {
              profile: true,
            },
          },
        },
      },
      profile: true
    },
  });

  const allUserPages = await db
    .select()
    .from(pages)
    .where(eq(pages.ownerId, session.id));

  // need this data in a format that is easier to manage
  const friendsArray: UserWithProfile[] = [];
  userData?.friends.forEach((f) => friendsArray.push(f.friend));

  // fetch sidebar data: friends and groups
  return typedjson({ session, friendsArray, allUserPages, userData });
};

export default function AppLayout() {
  const { friendsArray, allUserPages, userData } = useTypedLoaderData<typeof loader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          friends={friendsArray}
          pages={allUserPages}
        />
      </div>
      <div
        className={`${
          isSidebarOpen ? "col-span-10" : "col-span-12"
        } transition-all duration-300`}
      >
        <Navigation
          userData={userData}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </div>
    </div>
  );
}
