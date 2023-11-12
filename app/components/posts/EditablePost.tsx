import { Button } from "@/components/ui/button";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Form, useFetcher, useParams } from "@remix-run/react";
import { Post } from "db/schema";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { TextArea } from "@/components/ui/forms";
import { useEditable } from "@/hooks/editable";

// This post should be used for posts that are owned by the post author.
// The content can be edited and updated on the database.

interface EditableTextPostProps {
  post: Post;
}
export function EditableTextPost({ post }: EditableTextPostProps) {
  const {
    isEditing,
    setIsEditing,
    content,
    formRef,
    textAreaRef,
    handleBlur,
    handleKeyDown,
    setContent,
  } = useEditable(post);

  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className="group relative flex flex-col gap-2 border-b border-mauve4 p-3">
      <div className="absolute right-3 top-3 flex gap-x-2 opacity-0 transition-opacity delay-200 ease-in group-hover:opacity-100">
        <Button size={"icon"} onPress={() => setIsEditing(true)}>
          <Pencil1Icon />
        </Button>
        <fetcher.Form method="delete" action={`/posts/${post.id}`}>
          <Button
            variant={"secondary"}
            size={"icon"}
            type="submit"
            isDisabled={isDeleting}
          >
            <TrashIcon />
          </Button>
        </fetcher.Form>
      </div>

      {post.isUpdated && (
        <div className="text-sm font-light text-mauve10">edited</div>
      )}
      {isEditing ? (
        <Form method="PATCH" action={`/posts/${post.id}`} ref={formRef}>
          <TextArea
            ref={textAreaRef}
            onBlur={() => handleBlur(fetcher)}
            onKeyDown={handleKeyDown}
            onChange={(value) => setContent(value)}
            value={content}
            name="bodyUpdate"
          />
        </Form>
      ) : (
        <div className="flex flex-col gap-y-1">
          {post.onWall && (
            <p className="text-sm font-light text-mauve8">
              This was posted on{" "}
              <span className="text-ruby8">{post.wallUserId}</span>'s wall
            </p>
          )}
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked(content)),
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
