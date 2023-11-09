import { Button } from "@/components/ui/button";
import { auth } from "@/features/auth/helper";
import { Sidebar } from "@/features/navigation/components/Sidebar";
import { Transition } from "@headlessui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { groups } from "db/schema";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const allGroups = await db.select().from(groups);

  return json({ allGroups });
};

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { allGroups } = useLoaderData<typeof loader>();
  return (
    <>
      <Button onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
        Toggle Sidebar
      </Button>
      <div className="relative flex flex-grow gap-1">
        <Transition
          show={isSidebarOpen}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Sidebar groups={allGroups} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </Transition>
        <Outlet />
      </div>
    </>
  );
}
