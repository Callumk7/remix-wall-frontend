import { Button, Link, NavLink } from "@/components/ui/button";
import { UserData } from "../types";

interface UserControlsProps {
  user: UserData | null;
}
export function UserControls({ user }: UserControlsProps) {
  if (!user) {
    return (
      <form>
        <Link to={"/sign-in"}>Sign In</Link>
      </form>
    );
  } else {
    return (
        <div className="flex items-center gap-x-4">
          <NavLink variant={"link"} to={`/profile`}>{user.email}</NavLink>
          <form action="/sign-out" method="POST">
            <Button variant={"secondary"} type="submit">
              Sign Out
            </Button>
          </form>
        </div>
    );
  }
}
