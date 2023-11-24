import { Button, Link } from "@/components/ui/button";
import { Menu, MenuItem, Popover } from "@/components/ui/menu";
import { SlideOver } from "@/components/ui/slide-over";
import { UserControls } from "@/features/auth/components/UserControls";
import { UserData } from "@/features/auth/types";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useLocation } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";
import { MenuTrigger } from "react-aria-components";

const links = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Journal",
    to: "/journal",
  },
  {
    name: "Friends",
    to: "/friends",
  },
  {
    name: "Dev Feed",
    to: "/all",
  },
];

interface NavigationProps {
  session: UserData | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Navigation({
  session,
  isSidebarOpen,
  setIsSidebarOpen,
}: NavigationProps) {
  return (
    <nav className="my-5 flex w-full justify-between px-8">
      <div className="flex gap-x-6">
        {!isSidebarOpen && (
          <Button onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
            <ChevronRightIcon />
          </Button>
        )}
        <SlideOver trigger={<Button>Write a Post</Button>}>
          <CreatePostForm action="/posts" />
        </SlideOver>
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

function CreateNewMenu() {
  return (
    <MenuTrigger>
      <Button aria-label="Menu">Create New..</Button>
      <Popover>
        <Menu>
          <MenuItem>Page..</MenuItem>
          <MenuItem>Post..</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
