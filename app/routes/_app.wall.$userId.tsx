import { TextArea } from "@/components/ui/forms";
import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { getDayOfYear } from "@/features/posts/util";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
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

  return json({postToWall});
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const wallUserId = params.userId;

  // get all posts for the user
  const allPosts = await db.query.posts.findMany({
    where: eq(posts.wallUserId, wallUserId!),
    with: {
      author: true
    }
  })

  return typedjson({ session, allPosts });
};

export default function UserWallView() {
  const { session, allPosts } = useTypedLoaderData<typeof loader>();
  const params = useParams();
  const userId = params.userId;
  return (
    <div>
      <CreatePostForm />
      <div>
        {allPosts.map(post => (
          <TextPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
