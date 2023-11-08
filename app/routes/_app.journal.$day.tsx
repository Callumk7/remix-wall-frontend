import { auth } from "@/features/auth/helper";
import { JournalDayView } from "@/features/journal/components/JournalDayView";
import { JournalNavigation } from "@/features/journal/components/JournalNavigation";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { getUserPostsBetweenDates } from "@/features/journal/functions/queries";
import { reduceToPostSeries } from "@/features/journal/functions/util";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const startDay = Number(params.day);

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

  // TODO: Here
  return (
    <>
      <JournalNavigation />
      <div className="grid grid-cols-2 gap-1">
        {organisedPosts.map((series) => (
          <JournalDayView key={series.date.getTime()} postSeries={series} />
        ))}
      </div>
    </>
  );
}
