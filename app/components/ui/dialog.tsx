import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Button } from "./button";

export function MyDialog() {
  return (
    <DialogTrigger>
      <Button>Trigger...</Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) =>
          `fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur ${
            isEntering ? "duration-300 ease-out animate-in fade-in" : ""
          } ${isExiting ? "duration-200 ease-in animate-out fade-out" : ""}`
        }
      >
        <Modal
          className={({ isEntering, isExiting }) =>
            `w-full max-w-md overflow-hidden rounded-2xl bg-mauve1 p-6 text-left align-middle shadow-xl ${
              isEntering ? "duration-300 ease-out animate-in zoom-in-95" : ""
            } ${
              isExiting ? "duration-200 ease-in animate-out zoom-out-95" : ""
            }`
          }
        >
          <Dialog role="dialog">
            <Heading>This is the Heading</Heading>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
