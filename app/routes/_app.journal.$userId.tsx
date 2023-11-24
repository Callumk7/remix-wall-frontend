import { auth } from "@/features/auth/helper";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { ProfileWidget } from "@/features/profiles/components/ProfileWidget";
import {
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { db } from "db";
import { UserWithProfile, posts, users } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // If this is the currently logged in user's journal, redirect to the _index...
  if (params.userId === session.id) {
    redirect(`/journal`);
  }

  const journalUserId = params.userId;

  const userData = (await db.query.users.findFirst({
    where: eq(users.id, journalUserId!),
    with: {
      profile: true,
    },
  })) as UserWithProfile;

  const userPosts = await db.query.posts.findMany({
    where: eq(posts.authorId, journalUserId!),
  });

  return typedjson({ userData, userPosts });
};

export default function UserJournalPage() {
  const { userPosts, userData } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <h1 className="mb-6 text-5xl font-bold">
        {userData?.profile.userName}&apos;s{" "}
        <span className="underline decoration-ruby9">Journal</span>.
      </h1>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8 flex flex-col gap-y-6">
          {userPosts.map((post) => (
            <JournalTextPost key={post.id} post={post} />
          ))}
        </div>
        <div className="col-span-4 flex flex-col gap-y-5">
          <ProfileWidget user={userData} />
        </div>
      </div>
    </>
  );
}
