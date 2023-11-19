import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/forms";
import { Switch } from "@/components/ui/switch";
import { useFetcher } from "@remix-run/react";
import { KeyboardEvent, useRef } from "react";

// TODO: Pending state for new posts
// TODO: Disable form when pending
// TODO: Make this form work for walls as well

interface CreateNoteFormProps {
  date?: Date;
  action?: string;
}

export function CreateNoteForm({ date, action }: CreateNoteFormProps) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      fetcher.submit(formRef.current);
    }
  };

  return (
    <fetcher.Form
      className="relative flex flex-col gap-3 p-4"
      method="POST"
      action={action}
      ref={formRef}
    >
      <input type="hidden" value="note" name="type" />
      <TextArea
        type="text"
        name="body"
        label="Leave a note"
        onKeyDown={handleKeyDown}
      />
      <Button className="absolute bottom-8 right-8" type="submit">
        Leave a Note
      </Button>
    </fetcher.Form>
  );
}
