import { auth } from "@/features/auth/helper";
import { JournalPageCard } from "@/features/journal/components/JournalPageCard";
import { reduceToPostBatchArray } from "@/features/journal/functions/util";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // We need all the posts, organised into a post series
  const allUserPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, session.id));
  const allPostsByDate = reduceToPostBatchArray(allUserPosts);

  return typedjson({ session, allPostsByDate });
};

// TODO: The user should be able to choose between single column (single day) and double day view

export default function JournalIndex() {
  const { session, allPostsByDate } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <CreatePostForm action="/posts" />
      <div className="grid grid-cols-3 gap-4">
        {allPostsByDate.map((series) => (
          <JournalPageCard key={series.date.getTime()} postBatch={series} />
        ))}
      </div>
    </>
  );
}
