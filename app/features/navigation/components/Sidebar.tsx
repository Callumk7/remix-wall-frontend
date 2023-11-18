import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { UserWithProfile } from "db/schema";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  friends: UserWithProfile[];
}

export function Sidebar({ isOpen, setIsOpen, friends }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "" : "hidden"
      } fixed z-30 px-2 flex h-max min-h-screen w-64 flex-col gap-y-2 rounded-md border bg-mauve2 p-3`}
    >
      <Button
        size={"icon"}
        className="absolute right-3 top-3"
        onPress={() => setIsOpen(!isOpen)}
      >
        <ChevronLeftIcon />
      </Button>
      <Calendar className={"mt-10"} />
      <div className="my-8 flex flex-col gap-4">
        {friends.map((friend) => (
          <Link to={`/journal/${friend.id}`} key={friend.id}>
            {friend.profile.userName}
          </Link>
        ))}
      </div>
    </aside>
  );
}
