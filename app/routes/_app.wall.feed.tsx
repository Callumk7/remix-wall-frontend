import { auth } from "@/features/auth/helper";
import { TextPost } from "@/features/posts/components/TextPost";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { desc } from "drizzle-orm";

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

export default function FeedView() {
  const { allPosts } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-3">
      {allPosts.map((post) => (
        <TextPost key={post.id} post={post} />
      ))}
    </div>
  );
}
