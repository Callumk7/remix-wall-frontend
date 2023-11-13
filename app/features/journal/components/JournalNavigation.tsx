import { Link } from "@/components/ui/button";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useParams } from "@remix-run/react";

export function JournalNavigation() {
  const params = useParams();
  return (
    <div className="mb-4 flex w-full justify-between">
      <Link
        size={"icon"}
        variant={"link"}
        to={`/journal/${Number(params.day) - 1}`}
      >
        <DoubleArrowLeftIcon />
      </Link>
      <Link
        size={"icon"}
        variant={"link"}
        to={`/journal/${Number(params.day) + 1}`}
      >
        <DoubleArrowRightIcon />
      </Link>
    </div>
  );
}
