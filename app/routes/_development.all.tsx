import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts, postsRelations, users } from "db/schema";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const allPosts = await db
    .select()
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id));

  return json({ allPosts });
};

export default function DEVELOPMENT_FeedPage() {
  const { allPosts } = useLoaderData<typeof loader>();
  return (
    <div>
      {allPosts.map((postWithAuthor) => (
        <div key={postWithAuthor.posts.id} className="whitespace-pre">
          {JSON.stringify(postWithAuthor, null, "\t")}
        </div>
      ))}
    </div>
  );
}
