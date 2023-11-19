import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // We want to get a high level journal view, so that would be dates.
  const journalDates = await db
    .selectDistinct({ entryDate: posts.entryDate })
    .from(posts)
    .where(eq(posts.authorId, session.id));

  return typedjson({ session, journalDates });
};

export default function OverviewPage() {
  const { session, journalDates } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      {journalDates.map((date) => (
        <div key={date.entryDate?.toString()}>
          {date.entryDate?.toDateString()}
        </div>
      ))}
    </div>
  );
}
