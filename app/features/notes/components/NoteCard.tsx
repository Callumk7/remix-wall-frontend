import { Card } from "@/components/ui/card";
import { AuthorRow } from "@/features/posts/components/AuthorRow";
import { PostBody } from "@/features/posts/components/PostBody";
import { Note, NoteWithAuthor } from "db/schema";

interface NoteCardProps {
  note: NoteWithAuthor;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card>
      <AuthorRow author={note.author} />
      <PostBody body={note.body} />
    </Card>
  );
}
