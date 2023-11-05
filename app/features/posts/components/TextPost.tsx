import { Post, PostWithAuthor } from "db/schema";

interface TextPostProps {
  post: PostWithAuthor;
}

export function TextPost({ post }: TextPostProps) {
  const date = new Date(String(post.createdAt)).toDateString();
  return (
    <div className={`relative border p-3 ${post.isPrivate ? "bg-ruby4" : ""}`}>
      <input type="checkbox" name="select" className="absolute right-4 top-4" />
      <p className="text-sm">{date}</p>
      <p className="font-bold">{post.author.userName}</p>
      <p>{post.body}</p>
    </div>
  );
}
