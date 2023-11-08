import { Link } from "@/components/ui/button";
import { useParams } from "@remix-run/react";

const dayInMilliseconds = 24 * 60 * 60 * 1000;

export function JournalNavigation() {
  const params = useParams();
  return (
    <div className="flex w-full justify-between px-8">
      <Link to={`/journal/${Number(params.day) - dayInMilliseconds}`}>
        Back
      </Link>
      <Link to={`/journal/${Number(params.day) + dayInMilliseconds}`}>
        Forward
      </Link>
    </div>
  );
}
