import { auth } from "@/features/auth/helper";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";
import { desc } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// NOTE: This page should be the similar to old school facebook, where each user has their own 'wall', where other people can post messages and images, etc.
// These posts should also appear in the main feed, as anyone can comment on them.

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPosts = await db.query.posts.findMany({
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  return typedjson({ session, allPosts });
};

export default function WallPage() {
  const { session, allPosts } = useTypedLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-1/2">
      <h1 className="text-[76px] font-extrabold">
        <span className="underline decoration-ruby9">
          {session.fullName}&apos;s Feed
        </span>
        .
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

