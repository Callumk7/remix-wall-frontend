import { Button, Link } from "@/components/ui/button";
import { UserControls } from "@/features/auth/components/UserControls";
import { UserData } from "@/features/auth/types";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useLocation } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";

const links = [
  {
    name: "Wall",
    to: "/wall",
  },
  {
    name: "Journal",
    to: "/journal",
  },
  {
    name: "Profile",
    to: "/profile",
  },
  {
    name: "Dev Feed",
    to: "/all",
  },
];

interface NavbarProps {
  session: UserData | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Navbar({
  session,
  isSidebarOpen,
  setIsSidebarOpen,
}: NavbarProps) {
  return (
    <nav className="my-5 flex w-full justify-between px-8">
      <div className="flex gap-x-6">
        {!isSidebarOpen && (
          <Button onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
            <ChevronRightIcon />
          </Button>
        )}
        {links.map((link) => (
          <NavLink key={link.name} link={link} />
        ))}
      </div>
      <UserControls user={session} />
    </nav>
  );
}

function NavLink({ link }: { link: { name: string; to: string } }) {
  const location = useLocation();
  return (
    <Link
      variant={"link"}
      to={link.to}
      className={
        location.pathname === link.to
          ? "underline decoration-ruby9 decoration-2"
          : ""
      }
    >
      {link.name}
    </Link>
  );
}
