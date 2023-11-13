import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { getDaysSinceUnixEpoch } from "@/util/date-utilities";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Link, useFetcher } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";

function generateDates(currentDate: Date): Date[] {
  const datesArray: Date[] = [];

  // Generating 4 previous dates
  for (let i = 4; i > 0; i--) {
    const tempDate = new Date(currentDate);
    tempDate.setDate(currentDate.getDate() - i);
    datesArray.push(tempDate);
  }

  datesArray.push(new Date(currentDate)); // adding current date

  for (let i = 1; i <= 4; i++) {
    const tempDate = new Date(currentDate);
    tempDate.setDate(currentDate.getDate() + i);
    datesArray.push(tempDate);
  }

  return datesArray;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  // I need to generate a list of days that can be linked to journal days
  const currentDate = new Date(new Date().toString().split("T")[0]);

  const dateArray = generateDates(currentDate);

  const fetcher = useFetcher();
  return (
    <aside className="fixed z-30 ml-5 flex h-max min-h-screen w-64 flex-col gap-y-2 rounded-md border bg-mauve2 p-3">
      <Button
        size={"icon"}
        className="absolute right-3 top-3"
        onPress={() => setIsOpen(!isOpen)}
      >
        <ChevronLeftIcon />
      </Button>
      <Calendar className={"mt-10"} />
      <h2 className="font-bold">Journal Days</h2>
      <div className="flex flex-col gap-y-4 overflow-hidden">
        {dateArray.map((date) => (
          <Link
            className="whitespace-nowrap text-cyan9 underline"
            key={date.getTime()}
            to={`/journal/${getDaysSinceUnixEpoch(date)}`}
          >
            {date.toDateString()}
          </Link>
        ))}
      </div>
    </aside>
  );
}
