import { Post } from "db/schema";
import { PostBody } from "@/features/posts/components/PostBody";
import { Button } from "@/components/ui/button";
import { Component1Icon, DiscIcon, Share1Icon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

// This component displays a post to a non-owner. It should have non-editing functionality only.
// 1. Cross posting posts as notes to a feed or journal..

interface JournalTextPostProps {
  post: Post;
}

export function JournalTextPost({ post }: JournalTextPostProps) {
  return (
    <div className="relative flex flex-col gap-2 border-b border-mauve4 p-3">
      <JournalPostControlBar postId={post.id} />
      {post.isUpdated && (
        <div className="text-sm font-light text-mauve10">edited</div>
      )}
      <PostBody body={post.body} />
    </div>
  );
}

function JournalPostControlBar({ postId }: { postId: string }) {
  const fetcher = useFetcher()
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
