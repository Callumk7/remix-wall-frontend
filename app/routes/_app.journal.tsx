import { CreateJournalEntry } from "@/components/posts/CreateJournalEntry";
import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { handlePOST } from "./_api.posts";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);
  const response = await handlePOST(request, session.id);
  return json({ response });
};

export default function JournalLayout() {
  return (
    <div className="px-8">
      <CreateJournalEntry />
      <Outlet />
    </div>
  );
}
