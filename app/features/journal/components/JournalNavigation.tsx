import { Link } from "@/components/ui/button";
import { useParams } from "@remix-run/react";

export function JournalNavigation() {
  const params = useParams();
  return (
    <div className="flex w-full justify-between px-8">
      <Link to={`/journal/${Number(params.day) - 1}`}>Back</Link>
      <Link to={`/journal/${Number(params.day) + 1}`}>Forward</Link>
    </div>
  );
}

