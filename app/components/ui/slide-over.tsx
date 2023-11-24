import {
  DialogTrigger,
  ModalOverlay,
  Modal,
  Dialog,
} from "react-aria-components";
import { Button } from "./button";

interface SlideOverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function SlideOver({ trigger, children }: SlideOverProps) {
  return (
    <DialogTrigger>
      {trigger}
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-50 bg-mauve8/20 backdrop-blur focus:outline-none entering:animate-in entering:fade-in-0"
      >
        <Modal className="fixed bottom-0 right-0 top-0 w-3/4 bg-mauve1 shadow-lg shadow-blackA4 focus:outline-none entering:duration-300 entering:ease-out entering:animate-in entering:slide-in-from-right exiting:duration-300 exiting:animate-out exiting:slide-out-to-right">
          <Dialog className="p-3 focus:outline-none">
            {({ close }) => (
              <>
                <Button onPress={close} variant={"secondary"}>
                  Close
                </Button>
                {children}
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
