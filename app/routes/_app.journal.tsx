// NOTE: The journal page is used for personal posts. Basically a feed of public and
// private messages that can be viewed and filtered.
// It might be interesting to think about how we can prompt the user for this input.

import { Container } from "@/components/Container";
import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const userPosts = await db.select().from(posts).where(eq(posts.authorId, session.id));

  // We want to group posts by date. This could be done on the server ahead of time, 
  // but this could also be done on the client..

  return json({ userPosts });
};

export default function JournalPage() {
  const { userPosts } = useLoaderData<typeof loader>();
  return (
    <Container>
      {userPosts.map((post) => (
        <div key={post.id}>{post.body}</div>
      ))}
    </Container>
  );
}
