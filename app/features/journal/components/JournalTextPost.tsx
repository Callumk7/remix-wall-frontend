import { Post } from "db/schema";
import { PostBody } from "@/features/posts/components/PostBody";
import { Button } from "@/components/ui/button";
import { DiscIcon } from "@radix-ui/react-icons";
import { Link, useFetcher } from "@remix-run/react";
import { Separator } from "@/components/ui/separator";

interface JournalTextPostProps {
  post: Post;
}

export function JournalTextPost({ post }: JournalTextPostProps) {
  return (
    <div className="p-1">
      <Link
        to={`/journal/posts/${post.id}`}
        className="relative flex flex-col gap-2 rounded-lg border-mauve4 p-6 transition-colors ease-in-out hover:bg-mauve1"
      >
        <JournalPostControlBar postId={post.id} />
        {post.isUpdated && (
          <div className="text-sm font-light text-mauve10">edited</div>
        )}
        {post.title && (
          <h2 className="text-4xl font-black text-ruby10">{post.title}</h2>
        )}
        <PostBody body={post.body} />
      </Link>
      <Separator />
    </div>
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
