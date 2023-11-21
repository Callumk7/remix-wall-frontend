import { auth } from "@/features/auth/helper";
import { Navigation } from "@/features/navigation/components/Navigation";
import { Sidebar } from "@/features/navigation/components/Sidebar";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { UserWithProfile, users } from "db/schema";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

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
      <div className="col-span-2">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          friends={friendsArray}
        />
      </div>
      <div
        className={`${
          isSidebarOpen ? "col-span-10" : "col-span-12"
        } transition-all duration-300`}
      >
        <Navigation
          session={session}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </div>
    </div>
  );
}
