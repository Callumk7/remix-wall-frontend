import { auth } from "@/features/auth/helper";
import { organisePagesByDate } from "@/features/journal/functions/util";
import { PagePreviewCard } from "@/features/pages/components/PagePreviewCard";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { db } from "db";
import { Page, PageWithPostsAndNotes, pages } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPages = (await db.query.pages.findMany({
    with: {
      posts: true,
      notes: true,
    },
  })) as PageWithPostsAndNotes[];

  const pagesByDate = organisePagesByDate(allPages);

  return typedjson({ session, allPages, pagesByDate });
};
export default function PageView() {
  const { allPages, pagesByDate } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <div className="flex flex-col gap-8">
        {pagesByDate.map((pageBatch) => (
          <>
            <h2 className="font-bold py-3 text-xl text-cyan9">
              {pageBatch.date.toString()}
            </h2>
            <div
              key={pageBatch.date.toString()}
              className="grid grid-cols-4 gap-2"
            >
              {pageBatch.pages.map((page) => (
                <PagePreviewCard key={page.id} page={page} />
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
