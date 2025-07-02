"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { confirm } from "~/components/comfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { deleteListSeverity } from "~/core/api/severity";
import { FormSchema } from "./schema";
import { useStore } from "./store";
import { InspectIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { sleep } from "~/lib/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations("severity");
  const tGlobal = useTranslations("global");
  const queryClient = useQueryClient();


  const rowData = FormSchema.parse(row);
 

  const {
    setMode,
    setIsOpenSheet,
    setEditSystemData,
  } = useStore((state) => state);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteListSeverity,
    onSuccess(response: { data?: { message?: string } }) {
      if (response?.data?.message === "6002") {
      toast({
        title: t("form.errorTitle"),
      });
      return;
      }

      toast({
      title: t("form.success"),
      });
      queryClient.invalidateQueries({
      queryKey: ["getListLogEntry"],
      });
    },
    onError(error: any) {
      toast({
        title: t("form.error") || "Error",
      });
    },
  });

  const showEditForm = async () => {
    await sleep(200);
    setMode("edit");
    setIsOpenSheet(true);
    setEditSystemData(rowData);
  };

  const showViewForm = async () => {
    await sleep(200);
    setMode("view");
    setIsOpenSheet(true);
    setEditSystemData(rowData);
  };

  const handleDeleteFunction = async () => {
    await sleep(200);

    confirm({
      title: t("form.delete"),
      description: t("form.deleteTitle") + " " + (rowData.severity || ""),
      async onOk() {
        if (rowData.id) {
          deleteMutation.mutateAsync({
            ids: [rowData.id],
          });
        } else {
          toast({
            title: t("form.errorTitle"),
            description: t("form.idMissing") || "ID is missing.",
          });
        }
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full text-center">
        <InspectIcon className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("table.functionTitle")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={showEditForm}>
          {tGlobal("edit") || "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteFunction}>
          {tGlobal("delete") || "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
