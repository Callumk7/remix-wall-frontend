import { Container } from "@/components/Container";
import { auth } from "@/features/auth/helper";
import { reduceToPostSeries } from "@/features/journal/util";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { Post, posts } from "db/schema";
import { eq } from "drizzle-orm";
import { Link } from "react-aria-components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, session.id));

  // Can we refactor the raw posts into a format that we can use
  // for displaying posts based on the day that they were posted

  const postSeries = reduceToPostSeries(userPosts);
  const days: Date[] = [];
  postSeries.forEach((series) => days.push(series.date));

  return json({ postSeries, days });
};

export default function JournalPage() {
  const { postSeries, days } = useLoaderData<typeof loader>();
  return (
    <Container>
      <JournalNavigation days={days} />
      <CreatePostForm />
      {postSeries.map((series, i) => (
        <PostsFromDate key={i} date={series.date} posts={series.posts} />
      ))}
    </Container>
  );
}

function PostsFromDate({ date, posts }: { date: string; posts: Post[] }) {
  return (
    <div className="rounded-md bg-mauve1 p-3">
      <h2 className="font-xl font-extrabold">
        {new Date(date).toDateString()}
      </h2>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="whitespace-pre-wrap rounded-sm bg-mauve2 p-3"
          >
            {post.body}
          </div>
        ))}
      </div>
    </div>
  );
}

function JournalNavigation({ days }: { days: string[] }) {
  return (
    <div>
      {days.map((day) => (
        <p key={day}>{day}</p>
      ))}
    </div>
  );
}
