import { auth } from "@/features/auth/helper";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { getDayOfYear } from "@/features/posts/util";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { desc } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  console.log(session.id)

  const allPosts = await db.query.posts.findMany({
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  return json({ session, allPosts });
};

export default function WallPage() {
  const { session, allPosts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-4/5">
      <h1 className="text-[76px] font-extrabold">
        <span className="underline decoration-ruby9">Feed</span>.
      </h1>
      <CreatePostForm date={new Date()} />
      <div className="flex flex-col gap-3">
        {allPosts.map((post) => (
          <TextPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
