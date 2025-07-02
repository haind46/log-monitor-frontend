"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { deleteListSystem } from "~/core/api/system";
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
  const rowData = FormSchema.parse(
    ((row: any) => {
      return {
        id: row.id,
        code: row.code,
        name: row.name,
        level1: row.level1User?.id || null,
        level2: row.level2User?.id || null,
        level3: row.level3User?.id || null,
      };
    })(row)
  );
  const {
    setMode,
    isOpenSheet,
    setIsOpenSheet,
    setEditSystemData: setEditSystemData,
  } = useStore((state) => state);
  const session = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteListSystem,
    onSuccess(data) {
      if (response?.data?.message === "6002") {
        toast({
          title: t("users.form.errorTitle"),
        });
        return;
      }

      toast({
        title: t("users.form.success"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListSystem"],
      });
    },
    onError() {
      toast({
        title: t("form.error") || "Error",
      });
    },
  });

  const showEditForm = async () => {
    await sleep(200);
    console.log("sleep");
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
      title: t("users.form.delete"),
      description: t("users.form.deleteTitle") + " " + rowData.name,
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
