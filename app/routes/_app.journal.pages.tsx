import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { createCalendarDate } from "@/util/date-utilities";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import {  PageInsert, pages } from "db/schema";

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
      <Outlet />
    </div>
  );
}

