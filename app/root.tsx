import stylesheet from "@/tw.css";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { authenticator } from "./features/auth/auth.server";
import { Navbar } from "./features/navigation/components/Navbar";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { Sidebar } from "./features/navigation/components/Sidebar";
import { db } from "db";
import { groups } from "db/schema";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request);
  const allGroups = await db.select().from(groups);

  return json({ session, allGroups });
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { session, allGroups } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-mauve2 text-mauve12">
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
              groups={allGroups}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />
          </Transition>
          <div className={`${isSidebarOpen ? "col-span-10" : "col-span-12"} transition-all duration-300`}>
            <Navbar
              session={session}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
