import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { groups } from "db/schema";
import invariant from "tiny-invariant";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const groupName = formData.get("name")?.toString();

  invariant(groupName, "Name required for new group");

  const newGroup = await db.insert(groups).values({
    name: groupName,
  });

  return json(newGroup);
};
