import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/forms";
import { Switch } from "@/components/ui/switch";
import { useFetcher } from "@remix-run/react";

// TODO: Pending state for new posts
// TODO: Disable form when pending

export function CreatePostForm() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      className="flex flex-col gap-3 p-4"
      method="POST"
      action="/posts"
    >
      <TextArea type="text" name="body" label="Post body" />
      <Button type="submit">Send Post</Button>
      <div className="flex gap-2">
        <Switch label="Private" name="private" value="private" />
        <Switch label="Add One Day" name="addDay" value="one" />
      </div>
    </fetcher.Form>
  );
}
