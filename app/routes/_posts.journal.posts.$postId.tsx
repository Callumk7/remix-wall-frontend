import { auth } from "@/features/auth/helper";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const postId = params.postId;

  const fullPost = await db.query.posts.findFirst({
    where: eq(posts.id, postId!),
    with: {
      comments: {
        with: {
          author: {
            with: {
              profile: true,
            },
          },
        },
      },
    },
  });

  return typedjson({ session, fullPost });
};


export default function PostPage() {
  const { session, fullPost } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <JournalTextPost post={fullPost!} />
    </div>
  )
}
