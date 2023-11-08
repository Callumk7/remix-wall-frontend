import { Post } from "db/schema";

interface JournalTextPostProps {
  post: Post;
}
export function JournalTextPost({ post }: JournalTextPostProps) {
  return (
    <div className="flex flex-col gap-2 p-3 border-b border-mauve4">
      {post.createdAt && (
        <div className="text-mauve10 text-sm font-light">{post.createdAt.toTimeString()}</div>
      )}
      <div>{post.body}</div>
    </div>
  );
}
