import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/forms";
import { auth } from "@/features/auth/helper";
import { PagePreviewCard } from "@/features/pages/components/PagePreviewCard";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { db } from "db";
import { Page, PageWithPostsAndNotes, pages } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allDates = await db
    .selectDistinct({ dates: pages.entryDate, months: pages.month })
    .from(pages);

  const allPages = (await db.query.pages.findMany({
    with: {
      posts: true,
      notes: true,
    },
  })) as PageWithPostsAndNotes[];

  return typedjson({ session, allPages });
};
export default function PageView() {
  const { allPages } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {allPages.map((page) => (
          <PagePreviewCard key={page.id} page={page} />
        ))}
      </div>
    </div>
  );
}
