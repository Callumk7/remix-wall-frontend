import { Container } from "@/components/Container";
import { EditableTextPost } from "@/components/posts/EditablePost";
import { Card } from "@/components/ui/card";
import { auth } from "@/features/auth/helper";
import { getAllPosts } from "@/features/posts/queries/get-all-posts";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { profiles, posts, postsSavedByUsers, notes, Post } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // get session information
  const session = await auth(request);

  // get user profile information
  const userData = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.id));

  let userPosts: Post[] = [];
  try {
    const userPostsFromDb = await getAllPosts(session.id);
    userPosts = userPostsFromDb;
    console.log(userPostsFromDb);
  } catch (err) {
    console.error(err);
  }

  console.log(userPosts);

  return typedjson({ userData, userPosts });
};

export default function AllPostsPage() {
  const { userPosts } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      {userPosts.map((post) => (
        <Card key={post.id}>
          <h1>{post.title}</h1>
          <p className="p-2 w-full overflow-clip h-32">{post.body}</p>
        </Card>
      ))}
    </Container>
  );
}
