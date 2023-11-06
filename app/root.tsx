import stylesheet from "@/tw.css";
import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request);

  return json({ session });
};

export default function App() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-mauve2 text-mauve12">
        <Navbar session={session} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
