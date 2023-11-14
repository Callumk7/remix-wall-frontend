import { Link } from "@remix-run/react";
import { UserWithProfile } from "db/schema";


interface AuthorRowProps {
  author: UserWithProfile;
  wallRecipient?: UserWithProfile;
}
export function AuthorRow({ author, wallRecipient }: AuthorRowProps) {
  return (
    <div className="flex items-center gap-x-3">
      <Link
        to={`/wall/${author.id}`}
        className="font-bold text-ruby9 underline"
      >
        {author.profile.userName}
      </Link>
      {wallRecipient && (
        <>
          <span className="text-sm text-mauve10">posted on</span>
          <Link
            className="font-bold text-ruby9 underline"
            to={`/wall/${wallRecipient.id}`}
          >
            {wallRecipient.profile.userName}&apos;s Wall
          </Link>
        </>
      )}
    </div>
  );
}
