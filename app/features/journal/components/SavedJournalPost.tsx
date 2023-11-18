import { Post } from "db/schema";
import { PostBody } from "@/features/posts/components/PostBody";

interface SavedJournalPostProps {
  post: Post;
}

export function SavedJournalPost({ post }: SavedJournalPostProps) {
  return (
    <div className="relative bg-mauve3 rounded-md flex flex-col gap-2 border-b border-mauve4 p-3">
      {post.isUpdated && (
        <div className="text-sm font-light text-mauve10">edited</div>
      )}
      <PostBody body={post.body} />
    </div>
  );
}

