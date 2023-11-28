import { Button, Link, NavLink } from "@/components/ui/button";
import { UserData } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithProfileAndFriends } from "db/schema";

interface UserControlsProps {
  userData: UserWithProfileAndFriends;
}
export function UserControls({ userData }: UserControlsProps) {
  if (!userData) {
    return (
      <form>
        <Link to={"/sign-in"}>Sign In</Link>
      </form>
    );
  } else {
    return (
      <div className="flex items-center gap-x-4">
        <Avatar>
          <AvatarImage src={userData.profile.profilePictureUrl!} />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
        <NavLink variant={"link"} to={`/profile`}>
          {userData.email}
        </NavLink>
        <form action="/sign-out" method="POST">
          <Button variant={"secondary"} type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }
}
