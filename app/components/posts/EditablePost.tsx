import { Form, useFetcher } from "@remix-run/react";
import { Post, PostWithNotesWithAuthor } from "db/schema";
import { Input, TextArea } from "@/components/ui/forms";
import { useEditable } from "@/hooks/editable";
import { PostBody } from "@/features/posts/components/PostBody";
import { CommentCard } from "@/features/posts/components/Comment";
import { EditPostControls } from "./EditPostControls";
import { useState } from "react";

// INFO: This component is for OWNED POSTS viewed when logged in as the author.
// There should be shared components, but this component will handle the logic
// for editing, posting edits to the database, and then syncing those changes.

interface EditableTextPostProps {
  post: Post;
}
export function EditableTextPost({ post }: EditableTextPostProps) {
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

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

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="group relative col-span-2 flex flex-col gap-2 border-b border-mauve4 p-3">
        <p className="text-sm text-mauve8">{post.entryDate?.toDateString()}</p>
        <EditPostControls
          postId={post.id}
          setIsEditing={setIsEditing}
          setIsCommenting={setIsCommenting}
        />
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
          </div>
        )}
      </div>
      <div className="col-span-1">
        {isCommenting ? (
          <div>I am commenting</div>
        ) : (
          null
        )}
      </div>
    </div>
  );
}
