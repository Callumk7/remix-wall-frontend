import { UserData } from "../types";

interface UserControlsProps {
  user: UserData | null;
}
export function UserControls({ user }: UserControlsProps) {
  if (!user) {
    return (
      <div>
        <form>
          <button>Login</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <form action="/sign-out" method="POST">
          <button>Logout</button>
        </form>
        <div>Current User: {user.fullName}</div>
      </div>
    );
  }
}
