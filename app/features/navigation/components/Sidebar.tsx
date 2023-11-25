import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Page, UserWithProfile } from "db/schema";
import { Dispatch, SetStateAction } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";

// TODO: add page search

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  friends: UserWithProfile[];
  pages: Page[]
}

export function Sidebar({ isOpen, setIsOpen, friends, pages }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "" : "hidden"
      } relative z-30 flex h-max min-h-screen w-full min-w-fit flex-col gap-y-2 rounded-md border bg-mauve2 p-3 px-2`}
    >
      <Button
        size={"icon"}
        className="absolute right-3 top-3"
        onPress={() => setIsOpen(!isOpen)}
      >
        <ChevronLeftIcon />
      </Button>
      <SidebarTabs friends={friends} pages={pages} />
    </aside>
  );
}

const tabStyle =
  "p-2 outline-none cursor-default text-mauve10 relative transition-colors duration-200 hovered:text-mauve12 focus:text-ruby9 selected:text-ruby9";

interface SidebarTabsProps {
  friends: UserWithProfile[];
  pages: Page[];
}

function SidebarTabs({ friends, pages }: SidebarTabsProps) {
  return (
    <Tabs className={"flex orientation-horizontal:flex-col"}>
      <TabList className={"flex"}>
        <Tab id={"contacts"} className={tabStyle}>Contacts</Tab>
        <Tab id={"pages"} className={tabStyle}>Pages</Tab>
      </TabList>
      <TabPanel id="contacts">
        <div className="my-8 flex flex-col gap-4">
          {friends.map((friend) => (
            <Link to={`/journal/${friend.id}`} key={friend.id}>
              {friend.profile.userName}
            </Link>
          ))}
        </div>
      </TabPanel>
      <TabPanel id="pages">
        <div className="flex flex-col gap-y-2">
          {pages.map(page => (
            <Link to={`/journal/pages/${page.id}`} key={page.id}>
              <div className="border rounded-md p-1">
                <p>{page.title}</p>
                <p>{page.entryDate?.toDateString()}</p>
              </div>
            </Link>
          ))}
          <Button>New Page..</Button>
        </div>
      </TabPanel>
    </Tabs>
  );
}
