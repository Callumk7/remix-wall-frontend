import { Container } from "@/components/Container";
import { JournalNavigation } from "@/features/journal/components/JournalNavigation";
import { Outlet } from "@remix-run/react";

export default function JournalPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

