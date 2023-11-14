import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextArea } from "@/components/ui/forms";
import { useFetcher } from "@remix-run/react";
import {
  PostWithAuthorAndComments,
  Comment,
  UserWithProfile,
  CommentWithAuthor,
} from "db/schema";
import { useEffect, useState } from "react";
import { AuthorRow } from "./AuthorRow";
import { PostBody } from "./PostBody";
import { HeartIcon } from "@radix-ui/react-icons";
import { CommentCard } from "./Comment";
import { PostControls } from "./PostControls";

interface TextPostProps {
  author: UserWithProfile;
  post: PostWithAuthorAndComments;
  comments: CommentWithAuthor[];
  recipient?: UserWithProfile;
}

export function TextPost({ author, post, comments, recipient }: TextPostProps) {
  const [isCommenting, setIsCommenting] = useState(false);

  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.state === "submitting") {
      setIsCommenting(false);
    }
  }, [setIsCommenting, fetcher.state]);

  // TODO: more rogue date stuff
  const date = new Date(String(post.createdAt)).toDateString();

  return (
    <Card className="group relative">
      <PostControls postId={post.id} />
      {/*This should be a link to the correct date in the journal? at least when we sort out dates*/}
      <p className="text-sm font-light text-mauve8">{date}</p>
      <AuthorRow author={author} wallRecipient={recipient} />
      <PostBody body={post.body} />
      {comments && (
        <div className="flex flex-col gap-y-2">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      {isCommenting ? (
        <fetcher.Form
          className="flex flex-col gap-y-1"
          method="post"
          action={`/post/${post.id}`}
        >
          <TextArea label="comment" name="body" />
          <Button type="submit">Send</Button>
        </fetcher.Form>
      ) : (
        <Button
          className="w-fit opacity-0 transition-opacity ease-in group-hover:opacity-100"
          onPress={() => setIsCommenting(!isCommenting)}
        >
          Comment
        </Button>
      )}
    </Card>
  );
}
