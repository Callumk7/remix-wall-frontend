import { auth } from "@/features/auth/helper";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { getUserPostsBetweenDates } from "@/features/journal/functions/queries";
import { reduceToPostSeries } from "@/features/journal/functions/util";
import { getDayOfYear } from "@/features/posts/util";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// Here, we want to display:
// 1. Today and Yesterday's posts,
// 2. Controls for editing posts,
// 3. Controls for moving back and fowards (not in the index)
// 4. Controls for appending a post
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const dayToday = getDayOfYear(new Date());

  const userPosts = await getUserPostsBetweenDates(
    dayToday - 1,
    dayToday,
    session.id,
  );

  // Posts should be organised into collections from each day
  const organisedPosts = reduceToPostSeries(userPosts);

  return typedjson({ session, organisedPosts });
};

export default function JournalIndex() {
  const { session, organisedPosts } = useTypedLoaderData<typeof loader>();
  // This should return the current day, and -1 day
  return (
    <div className="grid grid-cols-2 gap-1">
      {organisedPosts.map((series) => (
        <div key={series.date.toString()}>
          {series.posts.map((post) => (
            <JournalTextPost key={post.id} post={post} />
          ))}
        </div>
      ))}
    </div>
  );
}
