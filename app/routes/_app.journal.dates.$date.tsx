import { auth } from "@/features/auth/helper";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { and, eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const date = params.date;
  invariant(date, "date must be provided");

  const postsFromDate = await db.query.posts.findMany({
    where: and(
      eq(posts.entryDate, new Date(date)),
      eq(posts.authorId, session.id),
    ),
    with: {
      comments: {
        with: {
          author: {
            with: {
              profile: true
            }
          }
        }
      }
    }
  });

  return typedjson({ session, postsFromDate });
};

export default function JournalDatePage() {
  const { postsFromDate } = useTypedLoaderData<typeof loader>();
  const params = useParams();
  return (
    <div>
      You made it here well done
      <span>{params.date}</span>
      <div>
        {postsFromDate.map((post) => (
          <JournalTextPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
