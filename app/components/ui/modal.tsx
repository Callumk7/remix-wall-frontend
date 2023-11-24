import {
  DialogTrigger,
  ModalOverlay,
  Modal,
  Dialog,
} from "react-aria-components";
import { Button } from "./button";

interface FormModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function FormModal({ trigger, children }: FormModalProps) {
  return (
    <DialogTrigger>
      {trigger}
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-50 bg-mauve8/20 backdrop-blur focus:outline-none entering:animate-in entering:fade-in-0 exiting:fade-out-0 exiting:animate-out entering:ease-in-out exiting:ease-in-out"
      >
        <Modal className="fixed inset-80 bg-mauve1 shadow-lg rounded-lg shadow-blackA4 focus:outline-none entering:duration-100 entering:ease-in-out entering:animate-in entering:zoom-in-95 entering:fade-in-0 exiting:duration-100 exiting:animate-out exiting:zoom-out-95 exiting:fade-out-0">
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
