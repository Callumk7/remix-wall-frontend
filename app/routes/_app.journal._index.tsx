import { Link } from "@/components/ui/button";

export default function JournalIndex() {
  return (
    <nav className="flex gap-3">
      <Link to={"/journal/pages"} variant={"link"}>Pages</Link>
      <Link to={"/journal/posts"} variant={"link"}>All Posts</Link>
      <Link to={"/journal/dates"} variant={"link"}>Dated Entries</Link>
    </nav>
  )
}
