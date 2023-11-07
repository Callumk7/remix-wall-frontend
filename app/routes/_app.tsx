import { auth } from "@/features/auth/helper";
import { Sidebar } from "@/features/navigation/components/Sidebar";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { groups, groupsRelations, usersToGroups } from "db/schema";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const allGroups = await db.select().from(groups);

  return json({ allGroups });
};

export default function AppLayout() {
  const { allGroups } = useLoaderData<typeof loader>();
  return (
    <div className="relative flex gap-1">
      <Sidebar groups={allGroups} />
      <Outlet />
    </div>
  );
}
