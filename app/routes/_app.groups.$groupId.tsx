import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const groupId = params.groupId;
  invariant(groupId, "groupId is required");

  const groupPosts = await db.query.posts.findMany({
    where: eq(posts.groupId, Number(groupId)),
  });

  return json({ session, groupPosts });
};

export default function GroupPage() {
  const { session, groupPosts } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>This is a groups page</h1>
    </div>
  );
}
