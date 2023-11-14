import { auth } from "@/features/auth/helper";
import { JournalDayView } from "@/features/journal/components/JournalDayView";
import { JournalNavigation } from "@/features/journal/components/JournalNavigation";
import { getUserPostsBetweenDates } from "@/features/journal/functions/queries";
import { reduceToPostBatchArray } from "@/features/journal/functions/util";
import { getDateFromDaysSinceUnixEpoch } from "@/util/date-utilities";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const daysSinceUnixEpoch = Number(params.day);

  console.log(getDateFromDaysSinceUnixEpoch(daysSinceUnixEpoch))

  // This route param is the number of days since the unix epoch.
  // We have to convert this to a javascript date object, and then get our posts from the database

  const journalPosts = await getUserPostsBetweenDates(
    getDateFromDaysSinceUnixEpoch(daysSinceUnixEpoch + 1),
    getDateFromDaysSinceUnixEpoch(daysSinceUnixEpoch + 2),
    session.id,
  );

  console.log(journalPosts);

  // Posts should be organised into collections from each day
  const organisedPosts = reduceToPostBatchArray(journalPosts);

  return typedjson({ session, organisedPosts });
};

export default function JournalDayPage() {
  const { session, organisedPosts } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <JournalNavigation />
      <div className="flex flex-col gap-y-6">
        {organisedPosts.map((postBatch) => (
          <JournalDayView
            key={postBatch.date.getTime()}
            postBatch={postBatch}
          />
        ))}
      </div>
    </>
  );
}
