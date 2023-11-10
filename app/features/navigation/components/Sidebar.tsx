import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { Group } from "db/schema";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  groups: Group[];
}

export function Sidebar({ groups, isOpen, setIsOpen }: SidebarProps) {
  const fetcher = useFetcher();
  return (
    <aside className="fixed ml-5 h-max bg-mauve2 min-h-screen w-64 rounded-md border p-3 z-30">
      <Button className="absolute top-3 right-3" onPress={() => setIsOpen(!isOpen)}>
        <ChevronLeftIcon />
      </Button>
      <div className="aspect-square w-full bg-mauve6 mt-8">Calendar goes here</div>
      <fetcher.Form
        className="flex flex-col gap-2"
        action="/groups"
        method="POST"
      >
        <Input label="Group Name" name="name" />
        <Button type="submit">Create Group</Button>
      </fetcher.Form>
      {groups && (
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <div key={group.id}>{group.name}</div>
          ))}
        </div>
      )}
    </aside>
  );
}
