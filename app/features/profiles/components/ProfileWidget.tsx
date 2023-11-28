import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { UserWithProfile } from "db/schema";

interface ProfileWidgetProps {
  user: UserWithProfile;
}

export function ProfileWidget({ user }: ProfileWidgetProps) {
  const fullName = user.profile.firstName + " " + user.profile.lastName;
  return (
    <div className="flex w-full flex-col bg-mauve1 gap-y-2 rounded-md border border-mauve3 p-4 shadow-blackA1">
      <div className="flex gap-x-3">
        <Avatar>
          <AvatarImage src={user.profile.profilePictureUrl!} />
          <AvatarFallback>BT</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-2">
          <div className="font-bold font-lg underline decoration-2 decoration-ruby9">{fullName}</div>
          <div className="font-light text-sm">{user.profile.userName}</div>
        </div>
      </div>
      <div>{user.profile.bio}</div>
    </div>
  );
}
