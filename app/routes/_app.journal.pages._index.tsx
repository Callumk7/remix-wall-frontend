import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { db } from "db";
import { Page, pages } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPages = await db
    .select()
    .from(pages)
    .where(eq(pages.ownerId, session.id));

  return typedjson({ session, allPages });
};
export default function PageView() {
  const { allPages } = useTypedLoaderData<typeof loader>();
  return (
      <div className="grid grid-cols-4 gap-2">
        {allPages.map((page) => (
          <PagePreviewCard key={page.id} page={page} />
        ))}
      </div>
  )
}

function PagePreviewCard({ page }: { page: Page }) {
  return (
    <Link to={`/journal/pages/${page.id}`}>
      <Card>
        <h1>{page.title}</h1>
        <h2>{page.entryDate?.toDateString()}</h2>
        <Button variant={"link"} className={"w-fit"}>New Post</Button>
      </Card>
    </Link>
  );
}
