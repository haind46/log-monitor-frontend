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
import { deleteListSystemCrLog } from "~/core/api/systemCrLog";
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
  const t = useTranslations("system-cr-log");
  const queryClient = useQueryClient();
  const rowData = FormSchema.parse(row);

  const {
    setMode,
    setIsOpenSheet,
    setEditSystemData,
  } = useStore((state) => state);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteListSystemCrLog,
    onSuccess(data) {
      toast({
        title: t("form.success"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListSystemCrLog"],
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
      description: t("form.deleteTitle") + " " + (rowData.impactedSystem || rowData.id),
      async onOk() {
        deleteMutation.mutateAsync({
          ids: rowData.id,
        });
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
          {t("form.edit") || "Edit"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteFunction}>
          {t("form.delete") || "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
