import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/forms";
import { Switch } from "@/components/ui/switch";
import { useFetcher } from "@remix-run/react";
import { KeyboardEvent, useRef } from "react";

// TODO: Pending state for new posts
// TODO: Disable form when pending
// TODO: Make this form work for walls as well

interface CreatePostFormProps {
  action: string;
}

export function CreatePostForm({ action }: CreatePostFormProps) {
  // Remix fetcher stuff
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      fetcher.submit(formRef.current);
      formRef.current?.reset()
    }
  };

  return (
    <fetcher.Form
      className="flex flex-col gap-3 p-4"
      method="POST"
      action={action}
      ref={formRef}
    >
      <TextArea
        type="text"
        name="body"
        label="Post body"
        onKeyDown={handleKeyDown}
      />
      <Button type="submit">{isSubmitting ? "Sending..." : "Send Post"}</Button>
      <div className="flex gap-2">
        <Switch label="Private" name="private" value="private" />
        <Switch label="Add One Day" name="addDay" value="one" />
      </div>
    </fetcher.Form>
  );
}
