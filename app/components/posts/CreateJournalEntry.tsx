import { Form } from "@remix-run/react";
import { TextArea } from "../ui/forms";
import { Button } from "../ui/button";

export function CreateJournalEntry() {
  return (
    <Form className="flex flex-col gap-y-1" method="POST">
      <TextArea placeholder="Create a new journal entry..." name="body" />
      <Button className="w-fit" type="submit">Send</Button>
    </Form>
  );
}
