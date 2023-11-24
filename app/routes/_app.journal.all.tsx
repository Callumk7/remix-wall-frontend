import { Container } from "@/components/Container";
import { EditableTextPost } from "@/components/posts/EditablePost";
import { auth } from "@/features/auth/helper";
import { getAllPosts } from "@/features/posts/queries/get-all-posts";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { profiles, posts, postsSavedByUsers, notes, PostWithCommentsWithAuthor } from "db/schema";
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

  let userPosts: PostWithCommentsWithAuthor[] = [];
  try {
    const userPostsFromDb = await getAllPosts(session.id);
    userPosts = userPostsFromDb;
    console.log(userPostsFromDb);

  } catch (err) {
    console.error(err);
  }

  const userNotes = await db.query.notes.findMany({
    where: eq(notes.recipientUserId, session.id),
    with: {
      author: {
        with: {
          profile: true,
        },
      },
    },
  });

  console.log(userPosts);

  return typedjson({ userData, userPosts, userNotes });
};

export default function AllPostsPage() {
  const { userPosts } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      {userPosts.map((post) => (
        <EditableTextPost key={post.id} post={post} />
      ))}
    </Container>
  );
}
