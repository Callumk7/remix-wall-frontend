import { auth } from "@/features/auth/helper";
import { JournalDayView } from "@/features/journal/components/JournalDayView";
import { JournalNavigation } from "@/features/journal/components/JournalNavigation";
import { getUserPostsBetweenDates } from "@/features/journal/functions/queries";
import { reduceToPostBatchArray } from "@/features/journal/functions/util";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const startDate = new Date(Number(params.day));
  const nextDate = new Date();
  nextDate.setDate(startDate.getDate() + 1);

  const userPosts = await getUserPostsBetweenDates(
    startDate,
    nextDate,
    session.id,
  );

  // Posts should be organised into collections from each day
  const organisedPosts = reduceToPostBatchArray(userPosts);

  return typedjson({ session, organisedPosts });
};

export default function JournalDayPage() {
  const { session, organisedPosts } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <JournalNavigation />
      <div className="grid grid-cols-2 gap-1">
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
