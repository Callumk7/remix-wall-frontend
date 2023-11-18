import { auth } from "@/features/auth/helper";
import { JournalPageCard } from "@/features/journal/components/JournalPageCard";
import { reduceToPostBatchArray } from "@/features/journal/functions/util";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// The index for this route is an overview of all the posts that the user has created.
// This should likely be organised by day, but There is no concept in the database of 
// a journal page (there could be in the future). So instead, lets just make sure we 
// Have a level of consistency.

// NOTES
// We can also see all notes that have been sent (posted to their journal), also organised
// by day in this view. A user might typically post to their overall page, and these can be 
// seen here in this view

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  return redirect(`/journal/${session.id}`)
};
