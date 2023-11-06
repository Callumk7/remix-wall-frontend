import { Sidebar } from "@/features/navigation/components/Sidebar";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const groups = await db.query.groups.findMany();

  return json({groups});
}

export default function AppLayout() {
  const {groups} = useLoaderData<typeof loader>();
  return (
    <div className="relative flex gap-1">
      <Sidebar groups={groups} />
      <Outlet />
    </div>
  );
}
