import { Button } from "@/components/ui/button";
import { Menu, MenuItem, Popover } from "@/components/ui/menu";
import { HamburgerMenuIcon, HeartIcon } from "@radix-ui/react-icons";
import { MenuTrigger } from "react-aria-components";

interface PostControlsProps {
  postId: string;
}

export function PostControls({ postId }: PostControlsProps) {
  return (
    <div className="absolute top-3 right-3 flex gap-x-1">
      <Button
        size={"icon"}
        variant="secondary"
      >
        <HeartIcon />
      </Button>
      <MenuTrigger>
        <Button>
          <HamburgerMenuIcon />
        </Button>
        <Popover>
          <Menu>
            <MenuItem>Save to Journal</MenuItem>
            <MenuItem>Delete Post</MenuItem>
            <MenuItem>Comment..</MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </div>
  );
}
