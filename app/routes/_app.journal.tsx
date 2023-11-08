import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { Link, Outlet, useParams } from "@remix-run/react";

// export const loader = async () => {
//   // This page needs to know all the days that the user has posted
// }

export default function JournalPage() {
  return (
    <Container>
      <JournalNavigation />
      <Outlet />
    </Container>
  );
}

function JournalNavigation() {
  const params = useParams();
  return (
    <div className="flex w-full justify-between px-8">
      <Link to={`/journal/${Number(params.day) - 1}`}>Back</Link>
      <Link to={`/journal/${Number(params.day) + 1}`}>Forward</Link>
    </div>
  );
}
