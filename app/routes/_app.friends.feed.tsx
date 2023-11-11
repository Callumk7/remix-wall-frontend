import { Container } from "@/components/Container";
import { auth } from "@/features/auth/helper";
import { TextPost } from "@/features/posts/components/TextPost";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts, userFriends, users } from "db/schema";
import { eq, inArray } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const friendsPosts = await db
    .select()
    .from(posts)
    .leftJoin(userFriends, eq(posts.authorId, userFriends.friendId))
    .where(eq(userFriends.userId, session.id))
    .leftJoin(users, eq(userFriends.friendId, users.id));

  const query = await db.query.posts.findMany({
    with: {
      author: {
        with: {
          friends: {
            where: eq(userFriends.friendId, session.id)
          }
        }
      }
    }
  })

  return json({ session, friendsPosts, query });
};

export default function FriendsFeed() {
  const { friendsPosts, query } = useLoaderData<typeof loader>();
  return (
    <Container>
      <div className="grid grid-cols-2 gap-3">
        {friendsPosts.map((friendsPost) => (
          <div key={friendsPost.posts.id}>
            <p>{friendsPost.users?.userName}</p>
            <p>{friendsPost.posts.body}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {query.map(post => (
          <div key={post.id}>
            <p>{post.author.userName}</p>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
