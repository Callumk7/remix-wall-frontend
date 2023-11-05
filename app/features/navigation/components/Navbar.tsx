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
    name: "Journal",
    to: "/journal",
  },
  {
    name: "Profile",
    to: "/profile",
  },
];

export function Navbar() {
  return (
    <nav className="mx-auto my-5 flex w-4/5 gap-x-6">
      {links.map((link) => (
        <NavLink key={link.name} link={link} />
      ))}
    </nav>
  );
}

// TODO: Need to link into how links and accessibility works with react aria components, and make sure that I also don't break client side routing.

function NavLink({ link }: { link: { name: string; to: string } }) {
  return <Link to={link.to}>{link.name}</Link>;
}
