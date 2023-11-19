import { CreateJournalEntry } from "@/components/posts/CreateJournalEntry";
import { EditableTextPost } from "@/components/posts/EditablePost";
import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { CreateNoteForm } from "@/features/journal/components/CreateNoteForm";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { SavedJournalPost } from "@/features/journal/components/SavedJournalPost";
import { NoteCard } from "@/features/notes/components/NoteCard";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { db } from "db";
import { notes, posts, postsSavedByUsers, profiles } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// Save a new note on a user's journal page. This functionality is incomplete
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userData = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.id));

  // I need a function with error handling for getting all posts. for now..
  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, session.id));

  const likedPosts = await db
    .select()
    .from(posts)
    .rightJoin(postsSavedByUsers, eq(posts.id, postsSavedByUsers.postId))
    .where(eq(postsSavedByUsers.userId, session.id));

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

  return typedjson({ userData, userPosts, userNotes, likedPosts });
};

export default function UserJournalPage() {
  const { userPosts, userData, userNotes, likedPosts } =
    useTypedLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-5xl font-bold">
        {userData[0].userName}&apos;s{" "}
        <span className="underline decoration-ruby9 decoration-2">Journal</span>.
      </h1>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8">
          {userPosts.map((post) => (
            <EditableTextPost key={post.id} post={post} />
          ))}
          <CreateJournalEntry />
          <div className="flex flex-col gap-y-2">
            {likedPosts.map((likedPost) => (
              <SavedJournalPost
                key={likedPost.posts?.id}
                post={likedPost.posts!}
              />
            ))}
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-y-5">
          <CreateNoteForm />
          {userNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </>
  );
}
