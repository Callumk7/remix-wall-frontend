import { Button, Link } from "@/components/ui/button";
import { UserData } from "@/features/auth/types";

const links = [
  {
    name: "sign-in",
    to: "/sign-in",
  },
  {
    name: "sign-out",
    to: "/sign-out",
  },
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
];

interface NavbarProps {
  session: UserData | null;
}

export function Navbar({ session }: NavbarProps) {
  return (
    <nav className="mx-auto my-5 flex w-4/5 justify-between">
      <div className="flex gap-x-6">
        {links.map((link) => (
          <NavLink key={link.name} link={link} />
        ))}
      </div>
      {session && (
        <div className="flex items-center gap-x-4">
          <p>{session.userName}</p>
          <form action="/sign-out" method="POST">
            <Button variant={"secondary"} type="submit">
              Logout
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
}

function NavLink({ link }: { link: { name: string; to: string } }) {
  return (
    <Link variant={"link"} to={link.to}>
      {link.name}
    </Link>
  );
}
