import {
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DatePickerProps,
  DateSegment,
  DateValue,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
} from "react-aria-components";


import { Button } from "./button";

interface MyDatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
}

export function MyDatePicker<T extends DateValue>(
  { label, ...props }: MyDatePickerProps<T>
) {
  return (
    <DatePicker {...props}>
      <Label>{label}</Label>
      <Group className="flex w-fit items-center">
        <DateInput>
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button>▼</Button>
      </Group>
      <Popover>
        <Dialog>
          <Calendar>
            <header>
              <Button slot="previous">◀</Button>
              <Heading />
              <Button slot="next">▶</Button>
            </header>
            <CalendarGrid>
              {(date) => <CalendarCell date={date} />}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
