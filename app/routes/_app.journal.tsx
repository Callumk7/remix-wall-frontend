import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { handlePOST } from "./_api.posts";
import { Link } from "@/components/ui/button";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);
  const response = await handlePOST(request, session.id);
  return json({ response });
};

export default function JournalLayout() {
  return (
    <div className="px-8">
    <nav className="flex gap-3">
      <Link to={"/journal/pages"} variant={"link"}>Pages</Link>
      <Link to={"/journal/posts"} variant={"link"}>All Posts</Link>
      <Link to={"/journal/dates"} variant={"link"}>Dated Entries</Link>
    </nav>
      <Outlet />
    </div>
  );
}
