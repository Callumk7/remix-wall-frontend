import { Link } from "@remix-run/react";
import { PostWithAuthor } from "db/schema";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface TextPostProps {
  post: PostWithAuthor;
}

export function TextPost({ post }: TextPostProps) {
  const date = new Date(String(post.createdAt)).toDateString();
  return (
    <div className={`relative border p-3 ${post.isPrivate ? "bg-ruby4" : ""}`}>
      <p className="text-sm">{date}</p>
      <Link to={`/wall/${post.authorId}`} className="font-bold underline text-ruby9">{post.author.userName}</Link>
        <div
          className="prose prose-sm min-w-full"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(post.body!)) }}
        ></div>
    </div>
  );
}
