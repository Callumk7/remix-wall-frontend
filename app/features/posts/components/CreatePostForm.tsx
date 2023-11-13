import { Button } from "@/components/ui/button";
import { MyDatePicker } from "@/components/ui/date-picker";
import { TextArea } from "@/components/ui/forms";
import { Switch } from "@/components/ui/switch";
import { useFetcher } from "@remix-run/react";
import { KeyboardEvent, useRef } from "react";

// TODO: Pending state for new posts
// TODO: Disable form when pending
// TODO: Make this form work for walls as well

interface CreatePostFormProps {
  date?: Date;
  action?: string;
}

export function CreatePostForm({ date, action }: CreatePostFormProps) {
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
      className="flex flex-col gap-3 p-4"
      method="POST"
      action={action}
      ref={formRef}
    >
      <input
        type="hidden"
        value={date ? date.toISOString() : new Date().toISOString()}
        name="entryDate"
      />
      <TextArea
        type="text"
        name="body"
        label="Post body"
        onKeyDown={handleKeyDown}
      />
      <Button type="submit">Send Post</Button>
      <div className="flex gap-2">
        <Switch label="Private" name="private" value="private" />
        <Switch label="Add One Day" name="addDay" value="one" />
      </div>
    </fetcher.Form>
  );
}
