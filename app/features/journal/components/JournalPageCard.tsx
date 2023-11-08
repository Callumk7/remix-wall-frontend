import { Link } from "@remix-run/react";
import { PostSeries } from "../types";
import { getDayOfYear } from "@/features/posts/util";

// TODO: I should make a card component with a shared card style (like this component has)

interface JournalPageCard {
  postSeries: PostSeries;
}
export function JournalPageCard({ postSeries }: JournalPageCard) {
  const cardHeaderText =
    postSeries.date.getDate() +
    "-" +
    postSeries.date.getMonth() +
    "-" +
    postSeries.date.getFullYear();

  const day = getDayOfYear(postSeries.date)

  return (
    <Link to={`/journal/${day}`} className="rounded-md border hover:bg-mauve3 p-3 h-80 overflow-clip">
      <h3 className="font-bold text-lg">{cardHeaderText}</h3>
      <div className="flex flex-col gap-y-1">
        {postSeries.posts.map((post) => (
          <p key={post.id} className="text-sm text-mauve10">{post.body}</p>
        ))}
      </div>
    </Link>
  );
}
