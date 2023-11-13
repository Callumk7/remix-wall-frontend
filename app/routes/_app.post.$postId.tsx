import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { comments, posts } from "db/schema";
import { eq } from "drizzle-orm";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const session = await auth(request);
  const postId = params.postId;
  const formData = await request.formData();
  const body = formData.get("body")?.toString();

  const newComment = await db.insert(comments).values({
    id: uuidv4(),
    postId: postId!,
    body: body!,
    authorId: session.id,
  });

  return json({ session, newComment });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const postId = params.postId;
  const session = await auth(request);

  const postData = await db.query.posts.findFirst({
    where: eq(posts.id, postId!),
    with: {
      comments: {
        with: {
          author: {
            with: {
              profiles: true,
            },
          },
        },
      },
      author: {
        with: {
          profiles: true,
        },
      },
    },
  });

  return json({ session, postData });
};

export default function PostPage() {
  return (
    <div>
      <h1>This is the Post Page</h1>
    </div>
  );
}
