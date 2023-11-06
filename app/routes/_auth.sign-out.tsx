import { authenticator } from "@/features/auth/auth.server";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  // This is the route for logging users out of the application
  await authenticator.logout(request, { redirectTo: "/" });

  return redirect("/");
};
