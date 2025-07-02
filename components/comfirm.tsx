"use client";

import { create } from "zustand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { TRPCClientError } from "@trpc/client";

interface State {
  open: boolean;
  title: string;
  description: string;
  cancelText: string;
  okText: string;
  onOk: () => void;
  setOnOk: (onOk: () => void) => void;
  setCancelText: (cancelText: string) => void;
  setOkText: (okText: string) => void;
  setDescription: (description: string) => void;
  setTitle: (title: string) => void;
  setOpen: (open: boolean) => void;
}

const useStore = create<State>((set) => ({
  open: false,
  title: "",
  description: "",
  cancelText: "Cancel",
  okText: "OK",
  onOk: () => {},
  setOnOk(onOk) {
    set({ onOk });
  },
  setCancelText(cancelText) {
    set({ cancelText });
  },
  setOkText(okText) {
    set({ okText });
  },
  setDescription(description) {
    set({ description });
  },
  setTitle(title) {
    set({ title });
  },
  setOpen(open) {
    set({ open });
  },
}));

interface ConfirmParams {
  title: string;
  description: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
}

export function confirm(params: ConfirmParams) {
  useStore.getState().setTitle(params.title);
  useStore.getState().setDescription(params.description);

  if (params.okText) {
    useStore.getState().setOkText(params.okText);
  } else {
    useStore.getState().setOkText("OK");
  }

  if (params.cancelText) {
    useStore.getState().setCancelText(params.cancelText);
  } else {
    useStore.getState().setCancelText("Cancel");
  }

  if (params.onOk) {
    useStore.getState().setOnOk(params.onOk);
  } else {
    useStore.getState().setOnOk(() => {});
  }

  useStore.getState().setOpen(true);
}

export function Confirmer() {
  const open = useStore((store) => store.open);
  const title = useStore((store) => store.title);
  const description = useStore((store) => store.description);
  const cancelText = useStore((store) => store.cancelText);
  const setOpen = useStore((store) => store.setOpen);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <CustomAction />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CustomAction() {
  const okText = useStore((store) => store.okText);
  const onOk = useStore((store) => store.onOk);

  if (onOk.constructor.name === "AsyncFunction") {
    return <AsyncAction />;
  }

  return <AlertDialogAction onClick={onOk}>{okText}</AlertDialogAction>;
}

function AsyncAction() {
  const okText = useStore((store) => store.okText);
  const setOpen = useStore((store) => store.setOpen);
  const onOk = useStore((store) => store.onOk);
  const [loading, setLoading] = useState(false);

  async function onAction() {
    try {
      setLoading(true);
      await onOk();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast({
          title: "Something went wrong !",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } finally {
      setOpen(false);
      setLoading(false);
    }
  }

  return (
    <Button onClick={onAction} disabled={loading}>
      {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {okText}
    </Button>
  );
}
