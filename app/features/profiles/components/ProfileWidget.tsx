import { UserWithProfile } from "db/schema";

interface ProfileWidgetProps {
  user: UserWithProfile;
}

export function ProfileWidget({ user }: ProfileWidgetProps) {
  const fullName = user.profiles.firstName + " " + user.profiles.lastName;
  return (
    <div className="flex w-full flex-col bg-mauve1 gap-y-2 rounded-md border border-mauve3 p-4 shadow-blackA1">
      <div className="font-bold font-lg underline decoration-2 decoration-ruby9">{fullName}</div>
      <div className="font-light text-sm">{user.profiles.userName}</div>
      <div>{user.profiles.bio}</div>
    </div>
  );
}
