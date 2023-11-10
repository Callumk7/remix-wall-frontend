import { Container } from "@/components/Container";
import { auth } from "@/features/auth/helper";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { desc } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// NOTE: This page should be the similar to old school facebook, where each user has their own 'wall', where other people can post messages and images, etc.
// These posts should also appear in the main feed, as anyone can comment on them.

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  return json({ session });
};

export default function WallPage() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
