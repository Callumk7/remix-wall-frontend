import { Card } from "@/components/ui/card";
import { Link } from "@remix-run/react";
import { Comment, CommentWithAuthor } from "db/schema";
import { PostBody } from "./PostBody";

interface CommentProps {
  comment: CommentWithAuthor
}

export function CommentCard({comment}: CommentProps) {
  return (
    <Card>
      <Link to={`/wall/${comment.authorId}`}>{comment.author.profile.userName}</Link>
      <PostBody body={comment.body} />
    </Card>
  )
}
