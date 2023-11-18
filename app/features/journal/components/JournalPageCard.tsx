import { Link } from "@remix-run/react";
import { PostBatchByDate } from "../types";
import { getDayOfYear } from "@/features/posts/util";
import { getDaysSinceUnixEpoch } from "@/util/date-utilities";

// TODO: I should make a card component with a shared card style (like this component has)

interface JournalPageCard {
  postBatch: PostBatchByDate;
}
export function JournalPageCard({ postBatch }: JournalPageCard) {

  return (
    <Link
      to={`/journal/dates/${postBatch.date.toISOString()}`}
      className="h-80 overflow-clip rounded-md border p-3 hover:bg-mauve3"
    >
      <h3 className="text-lg font-bold">{postBatch.date.toDateString()}</h3>
      <div className="flex flex-col gap-y-1">
        {postBatch.posts.map((post) => (
          <p key={post.id} className="text-sm text-mauve10">
            {post.body}
          </p>
        ))}
      </div>
    </Link>
  );
}
