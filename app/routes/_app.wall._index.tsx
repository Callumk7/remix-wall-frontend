// NOTE: The index for the wall page is the wall for the currently logged in user,and gives us an opportunity to add some special features if you are viewing your own wall.

// NOTE: Well, a question.. do we want to display posts by the user, or just posts directed towards the user?

import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  return json({ session });
};

export default function WallIndex() {
  return (
    <div>This is the wall index</div>
  )
}
