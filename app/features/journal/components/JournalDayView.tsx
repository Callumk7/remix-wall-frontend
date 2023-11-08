import { Button } from "@/components/ui/button";
import { PostSeries } from "../types";
import { JournalTextPost } from "./JournalTextPost";
import { useState } from "react";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";

interface JournalDayViewProps {
  postSeries: PostSeries;
}

export function JournalDayView({ postSeries }: JournalDayViewProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  return (
    <div>
      <h1 className="text-xl font-extrabold">
        {postSeries.date.toDateString()}
      </h1>
      {postSeries.posts.map((post) => (
        <JournalTextPost key={post.id} post={post} />
      ))}
      {isCreating ? (
        <CreatePostForm />
      ) : (
        <Button onPress={() => setIsCreating(true)}>Add Entry</Button>
      )}
    </div>
  );
}
