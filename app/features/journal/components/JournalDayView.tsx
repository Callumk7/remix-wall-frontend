import { Button } from "@/components/ui/button";
import { PostBatchByDate } from "../types";
import { JournalTextPost } from "./JournalTextPost";
import { useState } from "react";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { EditableTextPost } from "@/components/posts/EditablePost";

interface JournalDayViewProps {
  postBatch: PostBatchByDate;
}

export function JournalDayView({ postBatch }: JournalDayViewProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  return (
    <div>
      <h1 className="text-xl font-extrabold">
        {postBatch.date.toDateString()}
      </h1>
      {postBatch.posts.map((post) => (
        <EditableTextPost key={post.id} post={post} />
      ))}
      {isCreating ? (
        <CreatePostForm date={postBatch.date} action="/posts" />
      ) : (
        <Button onPress={() => setIsCreating(true)}>Add Entry</Button>
      )}
    </div>
  );
}
