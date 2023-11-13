// NOTE: The index for the wall page is the wall for the currently logged in user,and gives us an opportunity to add some special features if you are viewing your own wall.

// NOTE: Well, a question.. do we want to display posts by the user, or just posts directed towards the user?

import { auth } from "@/features/auth/helper";
import { TextPost } from "@/features/posts/components/TextPost";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts, profiles, users } from "db/schema";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const wallPosts = await db.query.posts.findMany({
    where: eq(posts.wallUserId, session.id),
    with: {
      comments: {
        with: {
          author: {
            with: {
              profiles: true,
            },
          },
        },
      },
      author: {
        with: {
          profiles: true,
        },
      },
    },
  });

  return json({ session, wallPosts });
};

export default function WallIndex() {
  const { wallPosts } = useLoaderData<typeof loader>();
  return (
    <div>
      {wallPosts.length !== 0
        ? wallPosts.map((post) => <TextPost key={post.id} post={post} />)
        : "No posts found on this wall"}
    </div>
  );
}
