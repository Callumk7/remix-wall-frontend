import { Post, PostWithCommentsWithAuthor } from "db/schema";
import { PostBody } from "@/features/posts/components/PostBody";
import { Button } from "@/components/ui/button";
import { Component1Icon, DiscIcon, Share1Icon } from "@radix-ui/react-icons";
import { Link, useFetcher } from "@remix-run/react";
import { CommentCard } from "@/features/posts/components/Comment";
import { Input } from "@/components/ui/forms";

// This component displays a post to a non-owner. It should have non-editing functionality only.
// 1. Cross posting posts as notes to a feed or journal..

interface JournalTextPostProps {
  post: PostWithCommentsWithAuthor;
}

export function JournalTextPost({ post }: JournalTextPostProps) {
  const fetcher = useFetcher();
  return (
    <Link to={`/journal/posts/${post.id}`} className="relative flex flex-col gap-2 border-b border-mauve4 p-3 transition-colors ease-in-out hover:bg-mauve1">
      <JournalPostControlBar postId={post.id} />
      {post.isUpdated && (
        <div className="text-sm font-light text-mauve10">edited</div>
      )}
      <PostBody body={post.body} />
      <div className="flex flex-col gap-y-2">
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        <fetcher.Form method="POST" action={`/journal/${post.authorId}`}>
          <input type="hidden" value="comment" name="type" />
          <input type="hidden" value={post.id} name="postId" />
          <Input name="comment" placeholder="Leave a comment?" />
        </fetcher.Form>
      </div>
    </Link>
  );
}

// Used for saving posts to your own journal
function JournalPostControlBar({ postId }: { postId: string }) {
  const fetcher = useFetcher();
  return (
    <div className="flex gap-x-2">
      <fetcher.Form action={`/posts/save/${postId}`} method="POST">
        <Button size={"icon"} type="submit">
          <DiscIcon />
        </Button>
      </fetcher.Form>
    </div>
  );
}
