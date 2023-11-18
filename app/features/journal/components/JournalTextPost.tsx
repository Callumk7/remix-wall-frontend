import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { Post } from "db/schema";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { TextArea } from "@/components/ui/forms";
import { PostBody } from "@/features/posts/components/PostBody";

/**
 * This component is used for displaying and editing journal entries, Post entities
 * which have isJournalEntry === true.
 * Journal entries are displayed differently to other posts, in that they can be 
 * shared as posts, but do not generally appear anywhere else other than on a 
 * user's journal page.
 * */

interface JournalTextPostProps {
  post: Post;
}
export function JournalTextPost({ post }: JournalTextPostProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [content, setContent] = useState<string>(post.body || "");

  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    fetcher.submit(formRef.current, {
      method: "PATCH",
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textAreaRef.current) {
        textAreaRef.current.blur();
      }
    }
  };

  return (
    <div className="group relative flex flex-col gap-2 border-b border-mauve4 p-3">
      <Button
        size={"icon"}
        className="absolute right-3 top-3 opacity-0 transition-opacity delay-200 ease-in group-hover:opacity-100"
        onPress={() => setIsEditing(true)}
      >
        <Pencil1Icon />
      </Button>
      {post.isUpdated && (
        <div className="text-sm font-light text-mauve10">edited</div>
      )}
      {isEditing ? (
        <fetcher.Form method="PATCH" action={`/posts/${post.id}`} ref={formRef}>
          <TextArea
            ref={textAreaRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={(value) => setContent(value)}
            value={content}
            name="bodyUpdate"
          />
        </fetcher.Form>
      ) : (
        <PostBody body={post.body} />
      )}
    </div>
  );
}
