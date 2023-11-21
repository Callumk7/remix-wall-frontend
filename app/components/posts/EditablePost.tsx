import { Button } from "@/components/ui/button";
import { DiscIcon, Pencil1Icon, PinRightIcon, TrashIcon } from "@radix-ui/react-icons";
import { Form, useFetcher, useParams } from "@remix-run/react";
import { Post, PostWithCommentsWithAuthor } from "db/schema";
import { marked } from "marked";
import DOMPurify from 'isomorphic-dompurify';
import { Input, TextArea } from "@/components/ui/forms";
import { useEditable } from "@/hooks/editable";
import { PostBody } from "@/features/posts/components/PostBody";
import { CommentCard } from "@/features/posts/components/Comment";

// This post should be used for posts that are owned by the post author.
// The content can be edited and updated on the database.

interface EditableTextPostProps {
  post: PostWithCommentsWithAuthor;
}
export function EditableTextPost({ post }: EditableTextPostProps) {
  // TODO: This hook.. I think it needs some cleaning up.
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
        <Button size={"icon"}>
          <DiscIcon />
        </Button>
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
        {post.title && (
          <h2 className="text-4xl font-black text-ruby10">{post.title}</h2>
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
        </div>
      )}
    </div>
  );
}
