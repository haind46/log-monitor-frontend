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
import { deleteListUser } from "~/core/api/user";
import { FormSchema } from "./schema";
import { useStore } from "./store";
import { InspectIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { sleep } from "~/lib/utils/time";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const rowData = FormSchema.parse(row);
  const { setMode, setIsOpenSheet, setEditUserGroupData } = useStore(
    (state) => state
  );
  const session = useSession();

  const deleteMutation = useMutation({
    mutationFn: deleteListUser,
    onSuccess(response) {
      console.log("data=", response)
      if (response?.data?.statusCode === 400) {
        toast({
          title: t("users.form.errorTitle"),
          description: t("users.form.errorTitleDescription"),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: t("users.form.success"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListUser"],
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

    setMode("edit");
    setEditUserGroupData(rowData);
    setIsOpenSheet(true);
  };

  const showViewForm = async () => {
    await sleep(200);
    setMode("view");
    setIsOpenSheet(true);
  };

  const handleDeleteFunction = async () => {
    await sleep(200);

    confirm({
      title: t("users.form.delete"),
      description: t("users.form.deleteTitle") + " " + rowData.username,
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
