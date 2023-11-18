import { Container } from "@/components/Container";
import { EditableTextPost } from "@/components/posts/EditablePost";
import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { CreateNoteForm } from "@/features/journal/components/CreateNoteForm";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { notes, posts, profiles } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const session = await auth(request);

  const formData = await request.formData();
  const noteBody = formData.get("body")?.toString();

  const recipient = params.userId;

  const newNote = await db
    .insert(notes)
    .values({
      id: `note_${uuidv4()}`,
      authorId: session.id,
      recipientUserId: recipient!,
      body: noteBody!,
    })
    .returning();

  return newNote;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);

  let isOwner = false;
  if (session.id === params.userId) {
    isOwner = true;
  }

  const journalUserId = params.userId;

  const userData = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, journalUserId!));

  // I need a function with error handling for getting all posts. for now..
  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, journalUserId!));

  const userNotes = await db.query.notes.findMany({
    where: eq(notes.recipientUserId, journalUserId!),
    with: {
      author: {
        with: {
          profile: true,
        },
      },
    },
  });

  console.log(userPosts);

  return typedjson({ userData, userPosts, userNotes, isOwner });
};

export default function UserJournalPage() {
  const { userPosts, userData, userNotes, isOwner } =
    useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <h1 className="text-5xl font-bold">{userData[0].userName}</h1>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8">
          {isOwner && (
            <CreatePostForm action="/posts" />
          )}
          {userPosts.map((post) =>
            isOwner ? (
              <JournalTextPost key={post.id} post={post} />
            ) : (
              <EditableTextPost key={post.id} post={post} />
            ),
          )}
        </div>
        <div className="col-span-4 flex flex-col gap-y-5">
          <CreateNoteForm />
          {userNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </Container>
  );
}
