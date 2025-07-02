"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
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
import { createConfig, deleteListConfig } from "~/core/api/waring-config";
import { FormSchema } from "./schema";
import { useStore } from "./store";
import { InspectIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { sleep } from "~/lib/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const rowData = FormSchema.parse(row);

  const {
    setMode,
    isOpenSheet,
    setIsOpenSheet,
    setEditSystemData: setEditSystemData,
  } = useStore((state) => state);
  const session = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteListConfig,
    onSuccess() {
      toast({
        title: t("config.form.success"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListConfig"],
      });
    },
    onError() {
       toast({
        title: `${t('userManagement.sheet.message.title.delete')}`,
        description: `${t(
          'userManagement.sheet.message.description.delete.fail',
        )}`,
      })
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
      title: t("config.form.delete"),
      description: t("config.form.deleteTitle") + " " + rowData.keyName,
      async onOk() {
        deleteMutation.mutateAsync({
          ids: rowData.id, // Đảm bảo là mảng
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
        <DropdownMenuLabel>{t("users.table.functionTitle")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={showEditForm}>
          {t("users.table.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteFunction}>
          {t("users.table.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
