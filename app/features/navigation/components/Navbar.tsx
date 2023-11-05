import { Link } from "@remix-run/react";

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
    name: "protected",
    to: "/protected",
  },
  {
    name: "Wall",
    to: "/wall",
  },
  {
    name: "Profile",
    to: "/profile",
  },
];

export function Navbar() {
  return (
    <nav>
      {links.map((link) => (
        <Link key={link.name} to={link.to}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
