import { Form } from "@remix-run/react";
import { Input, TextArea } from "../ui/forms";
import { Button } from "../ui/button";
import clsx from "clsx";

interface CreateJournalEntryProps {
  className?: string;
  action: string;
}

export function CreateJournalEntry({
  className,
  action,
}: CreateJournalEntryProps) {
  return (
    <Form
      className={clsx(className, "flex flex-col gap-y-3")}
      method="POST"
      action={action}
    >
      <Input placeholder="Fancy a title?" name="title" label="Post Title" />
      <TextArea
        placeholder="Create a new journal entry..."
        name="body"
        label="Post Contents"
      />
      <Button className="w-fit" type="submit">
        Send
      </Button>
    </Form>
  );
}
