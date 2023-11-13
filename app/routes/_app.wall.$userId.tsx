import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { getDayOfYear } from "@/features/posts/util";
import { ProfileWidget } from "@/features/profiles/components/ProfileWidget";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { db } from "db";
import { UserWithProfile, posts, users } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // Create a post as the user from the current session,
  // for the user in the URL param
  const session = await auth(request);
  const wallUserId = params.userId;

  const formData = await request.formData();
  const postBody = formData.get("body")?.toString();

  // NOTE: as the user is posting to someone elses wall, we can set the journal date as the day that the user posted. This means it is all essentially the same as the created date
  const createdAt = new Date();

  const postToWall = await db.insert(posts).values({
    id: `post_${uuidv4()}`,
    body: postBody!,
    authorId: session.id,
    createdAt: createdAt,
    entryDate: createdAt,
    day: getDayOfYear(createdAt),
    month: createdAt.getMonth(),
    year: createdAt.getFullYear(),
    onWall: true,
    wallUserId: wallUserId,
  });

  return json({ postToWall });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const wallUserId = params.userId;

  // get user data
  const userData = await db.query.users.findFirst({
    where: eq(users.id, params.userId!),
    with: {
      profiles: true,
    },
  }) as UserWithProfile;

  // TODO: Need to use zod or something to ensure that the shape of the user matches what is required for the components below. I own the data though, so I think it should be ok. The logic for this should be examined from start to finish to see what the risk is

  // get all posts for the user
  const allPosts = await db.query.posts.findMany({
    where: eq(posts.wallUserId, wallUserId!),
    with: {
      comments: true,
      author: {
        with: {
          profiles: true,
        },
      },
    },
  });

  return typedjson({ session, allPosts, userData });
};

export default function UserWallView() {
  const { session, allPosts, userData } = useTypedLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-6">
      <div className="col-span-4">
        <h1 className="text-xl font-bold">
          {userData?.profiles.userName}&apos;s feed
        </h1>
        <CreatePostForm />
        <div>
          {allPosts.map((post) => (
            <TextPost key={post.id} post={post} />
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <ProfileWidget user={userData} />
      </div>
    </div>
  );
}
