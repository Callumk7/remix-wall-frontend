import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { groups } from "db/schema";
import invariant from "tiny-invariant";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const allGroups = await db.select().from(groups);

  return json({ session, allGroups });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const groupName = formData.get("name")?.toString();

  invariant(groupName, "Name required for new group");

  const newGroup = await db.insert(groups).values({
    name: groupName,
  });

  return json(newGroup);
};

export default function GroupsPage() {
  const { session, allGroups } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>This is the groups page</h1>
      {allGroups.map((group) => (
        <div key={group.id}>{group.name}</div>
      ))}
    </div>
  );
}
