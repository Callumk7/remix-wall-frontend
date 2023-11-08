import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Post } from "db/schema";
import { useState } from "react";

interface JournalTextPostProps {
  post: Post;
}
export function JournalTextPost({ post }: JournalTextPostProps) {
  const [content, setContent] = useState<string>(() => {
    if (post.body) {
      return post.body;
    } else return "";
  });

  return (
    <div className="group relative flex flex-col gap-2 border-b border-mauve4 p-3">
      <Button
        size={"icon"}
        className="absolute right-3 top-3 opacity-0 transition-opacity ease-in group-hover:opacity-100 delay-200"
      >
        <Pencil1Icon />
      </Button>
      {post.createdAt && (
        <div className="text-sm font-light text-mauve10">
          {post.createdAt.toTimeString()}
        </div>
      )}
      <div>{post.day}</div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border-0 bg-mauve2 p-1 text-mauve12"
      />
    </div>
  );
}
