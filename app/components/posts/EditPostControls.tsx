import { DiscIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useFetcher } from "@remix-run/react";

interface EditPostControlsProps {
  postId: string;
  setIsEditing: (isEditing: boolean) => void; 
}

export function EditPostControls({ postId, setIsEditing }: EditPostControlsProps) {
  // Fetcher stuff.
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className="absolute right-3 top-3 flex gap-x-2 opacity-0 transition-opacity delay-200 ease-in group-hover:opacity-100">
      <Button size={"icon"}>
        <DiscIcon />
      </Button>
      <Button size={"icon"} onPress={() => setIsEditing(true)}>
        <Pencil1Icon />
      </Button>
      <fetcher.Form method="delete" action={`/posts/${postId}`}>
        <Button
          variant={"secondary"}
          size={"icon"}
          type="submit"
          isDisabled={isDeleting}
        >
          <TrashIcon />
        </Button>
      </fetcher.Form>
    </div>
  );
}
