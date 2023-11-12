import { UserData } from "@/features/auth/types"

interface ProfileWidgetProps {
  profile: UserData
}

export function ProfileWidget({profile}: ProfileWidgetProps) {
  return (
    <div>
      <h1>{profile.fullName}</h1>
    </div>
  )
}

