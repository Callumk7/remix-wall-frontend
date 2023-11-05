import { auth } from "@/features/auth/helper";
import { TextPost } from "@/features/posts/components/TextPost";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { desc } from "drizzle-orm";
import FeedView from "./_app.wall.feed";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPosts = await db.query.posts.findMany({
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  return json({ session, allPosts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = formData.get("body")?.toString();
  const userId = Number(formData.get("userId")?.toString());

  // Create an entry in the database, will need to be validated at some point
  // I should create somewhere to put common queries
  const newPost = await db.insert(posts).values({
    hasBody: true,
    body: body,
    hasImage: false,
    authorId: userId,
  });

  console.log(JSON.stringify(newPost));

  return json(
    { newPost },
    { status: 200, statusText: "Successfully created a new post" },
  );
};

export default function WallPage() {
  const { session, allPosts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-4/5">
      <h1 className="text-[76px] font-extrabold">Feed.</h1>
      <form className="flex flex-col gap-3 border p-4" method="POST">
        <input type="text" placeholder="Create a post.." name="body" />
        <input type="hidden" value={session.id} name="userId" />
        <button>Send Post</button>
      </form>
      <Outlet />
    </div>
  );
}
