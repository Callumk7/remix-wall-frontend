import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms";
import { useFetcher } from "@remix-run/react";
import { Group } from "db/schema";

interface SidebarProps {
  groups: Group[];
}

export function Sidebar({ groups }: SidebarProps) {
  const fetcher = useFetcher();
  return (
    <div className="ml-5 h-max min-h-screen w-64 rounded-md border p-3">
      <fetcher.Form className="flex flex-col gap-2" action="/groups" method="POST">
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
    </div>
  );
}
