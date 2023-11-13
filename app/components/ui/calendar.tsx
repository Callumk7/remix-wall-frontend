import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  Heading as AriaHeading,
  CalendarProps,
  DateValue,
  Text,
} from "react-aria-components";
import { Button } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "@remix-run/react";
import { CalendarDate } from "@internationalized/date";
import { getDateFromDaysSinceUnixEpoch, getDaysSinceUnixEpoch } from "@/util/date-utilities";

interface CalendarFullProps<T extends DateValue> extends CalendarProps<T> {
  errorMessage?: string;
}

function Calendar<T extends DateValue>({
  errorMessage,
  ...props
}: CalendarFullProps<T>) {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <AriaCalendar
      className={"w-fit max-w-full"}
      {...props}
      onChange={(v) =>
        navigate(`/journal/${getDaysSinceUnixEpoch(v.toDate("gmt"))}`)
      }
    >
      <header className="mx-1 mb-[.5rem] flex items-center">
        <Button size={"icon"} variant={"link"} slot="previous">
          <ChevronLeftIcon />
        </Button>
        <AriaHeading className="flex-1 text-center font-semibold" />
        <Button size={"icon"} variant={"link"} slot="next">
          <ChevronRightIcon />
        </Button>
      </header>
      <AriaCalendarGrid>
        {(date) => (
          <AriaCalendarCell
            className="box-border w-8 cursor-default rounded-md border-2 border-mauve2 text-center text-sm leading-8 outline-none focus-visible:border-ruby9 focus-visible:shadow-ruby9 pressed:bg-mauve4 selected:bg-ruby9 selected:text-mauve1 outside-month:hidden"
            date={date}
          />
        )}
      </AriaCalendarGrid>
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </AriaCalendar>
  );
}

export { Calendar };
