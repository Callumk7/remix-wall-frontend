import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { CreateNoteForm } from "@/features/journal/components/CreateNoteForm";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { ProfileWidget } from "@/features/profiles/components/ProfileWidget";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { db } from "db";
import { UserWithProfile, comments, notes, posts, users } from "db/schema";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const session = await auth(request);

  const formData = await request.formData();

  const type = formData.get("type");
  invariant(type, "type must be provided");

  if (type === "note") {
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
  } else if (type === "comment") {
    const commentBody = formData.get("comment")?.toString();
    const postId = formData.get("postId")?.toString();
    const newComment = await db
      .insert(comments)
      .values({
        id: `com_${uuidv4()}`,
        postId: postId!,
        authorId: session.id,
        body: commentBody!,
      })
      .returning();
    return newComment;
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // If this is the currently logged in user's journal, redirect to the _index...
  if (params.userId === session.id) {
    redirect(`/journal`);
  }

  const journalUserId = params.userId;

  const userData = (await db.query.users.findFirst({
    where: eq(users.id, journalUserId!),
    with: {
      profile: true,
    },
  })) as UserWithProfile;

  // I need a function with error handling for getting all posts. for now..
  const userPosts = await db.query.posts.findMany({
    where: eq(posts.authorId, journalUserId!),
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

  return typedjson({ userData, userPosts, userNotes });
};

export default function UserJournalPage() {
  const { userPosts, userData, userNotes } =
    useTypedLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-5xl font-bold mb-6">
        {userData?.profile.userName}&apos;s{" "}
        <span className="underline decoration-ruby9">Journal</span>.
      </h1>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8 flex flex-col gap-y-6">
          {userPosts.map((post) => (
            <JournalTextPost key={post.id} post={post} />
          ))}
        </div>
        <div className="col-span-4 flex flex-col gap-y-5">
          <ProfileWidget user={userData} />
          <CreateNoteForm />
          {userNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </>
  );
}
