import { auth } from "@/features/auth/helper";
import { Navbar } from "@/features/navigation/components/Navbar";
import { Sidebar } from "@/features/navigation/components/Sidebar";
import { Transition } from "@headlessui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { UserWithProfile, users } from "db/schema";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { inspect } from "util";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // fetching a user with all their friends and groups, for the sidebar
  const userWithConnections = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    with: {
      friends: {
        with: {
          friend: {
            with: {
              profile: true
            }
          }
        }
      }
    }
  })

  // need this data in a format that is easier to manage
  const friendsArray: UserWithProfile[] = [];
  userWithConnections?.friends.forEach(f => friendsArray.push(f.friend))

  // fetch sidebar data: friends and groups
  return typedjson({ session, friendsArray });
};


export default function AppLayout() {
  const { session, friendsArray } = useTypedLoaderData<typeof loader>()
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <div className="grid grid-cols-12">
      <Transition
        className="sticky col-span-2"
        show={isSidebarOpen}
        enter="transition-transform duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          friends={friendsArray}
        />
      </Transition>
      <div
        className={`${
          isSidebarOpen ? "col-span-10" : "col-span-12"
        } transition-all duration-300`}
      >
        <Navbar
          session={session}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </div>
    </div>
  );
}
