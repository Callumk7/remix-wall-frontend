import { auth } from "@/features/auth/helper";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { getUserPostsBetweenDates } from "@/features/journal/functions/queries";
import { reduceToPostSeries } from "@/features/journal/functions/util";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const startDay = Number( params.day );


  const userPosts = await getUserPostsBetweenDates(
    startDay,
    startDay + 1,
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
          <h1 className="text-xl font-extrabold">{series.date.toDateString()}</h1>
          {series.posts.map((post) => (
            <JournalTextPost key={post.id} post={post} />
          ))}
        </div>
      ))}
    </div>
  );
}
