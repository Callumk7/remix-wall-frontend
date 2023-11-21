import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { createCalendarDate } from "@/util/date-utilities";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { PageWithPostsAndNotes, pages } from "db/schema";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// This page is going to handle pages, which are collections of posts and notes
export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  const currentDate = createCalendarDate(new Date());

  const newPage = await db.insert(pages).values({
    id: `page_${uuidv4()}`,
    ownerId: session.id,
    day: currentDate.day,
    month: currentDate.month,
    year: currentDate.year,
    entryDate: currentDate.toDate("gmt"),
  });

  return json({ session, newPage });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPages = await db.select().from(pages);

  return typedjson({ session, allPages });
};

export default function JournalDateLayout() {
  const { allPages } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <form method="POST">
        <button>Create new page</button>
      </form>
      <div>
        {allPages.map((page) => (
          <PageComponent key={page.id} page={page} />
        ))}
      </div>
      <Outlet />
    </div>
  );
}

function PageComponent({ page }: { page: PageWithPostsAndNotes }) {
  return (
    <div>
      <h1>{page.title}</h1>
    </div>
  );
}
