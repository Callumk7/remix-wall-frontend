import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/forms";
import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { createCalendarDate } from "@/util/date-utilities";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { Page, PageInsert, pages } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// This page is going to handle pages, which are collections of posts and notes
export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  const formData = await request.formData();
  const title = formData.get("title")?.toString();

  const currentDate = createCalendarDate(new Date());

  const newPageValues: PageInsert = {
    id: `page_${uuidv4()}`,
    ownerId: session.id,
    day: currentDate.day,
    month: currentDate.month,
    year: currentDate.year,
    entryDate: currentDate.toDate("gmt"),
  };

  if (title) {
    newPageValues.title = title;
  }

  const newPage = await db.insert(pages).values(newPageValues);

  return json({ session, newPage });
};


export default function PagesPage() {

  return (
    <div>
      <Form method="POST">
        <Input
          label="Page Title"
          name="title"
          placeholder="What is your page title?"
        />
        <Button type="submit">Create new Page</Button>
      </Form>
      <Outlet />
    </div>
  );
}

