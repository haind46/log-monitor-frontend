"use client";

import { PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "./store";
import { confirm } from "~/components/comfirm";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { deleteListSeverity } from "~/core/api/severity";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UserHeading() {
  const t = useTranslations("severity");
  const tGlobal = useTranslations("global");

  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const queryClient = useQueryClient();
  const { setMode, setIsOpenSheet, resetSelectedUserIds } = useStore(
    (state) => state
  );
  const searchKeyword = useStore((store) => store.searchKeyword);
  const setSearchKeyword = useStore((store) => store.setSearchKeyword);

  function showCreateForm() {
    setMode("create");
    setIsOpenSheet(true);
  }

  // xu ly xoa nhieu ban ghi
  const deleteMutation = useMutation({
    mutationFn: deleteListSeverity,
    onSuccess(data: any) {
      if (data?.message === "6002") {
        toast({
          variant: "destructive",
          title: t("form.errorTitle"),
        });
        return;
      }

      toast({
        title: t("form.success"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListSeverity"],
      });
    },
    onError(error: unknown) {
      toast({
        variant: "destructive",
        title: (error as { message?: string })?.message || t("form.errorTitle"),
      });
    },
  });

  function deleteSeverities() {
    confirm({
      title: t("form.mutipleDelete"),
      description:
        `(${selectedUserIds.length}) ` + t("form.mutipleDeleteTitle"),
      async onOk() {
        deleteMutation.mutateAsync({
          ids: selectedUserIds as string[],
        });
        resetSelectedUserIds();
      },
    });
  }

  // Hàm xử lý khi nhấn Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchKeyword((event.target as HTMLInputElement).value);
    }
  };

  return (
    <div className="w-full flex justify-between mb-4">
      <div className="font-bold text-xl">{t("table.name")}</div>
      <div className="flex items-center">
        {selectedUserIds.length > 0 && (
          <Button variant="destructive" onClick={deleteSeverities}>
            <TrashIcon size={18} className="mr-2" />
            {t("form.delete")} ({selectedUserIds.length})
          </Button>
        )}

        <div className="relative ml-2 flex items-center">
          <input
            type="text"
            placeholder={tGlobal("filter")}
            defaultValue={searchKeyword}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-lg pl-10 pr-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon
            size={18}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>

        <Button onClick={showCreateForm} className="ml-2">
          <PlusCircleIcon size={18} className="mr-2" /> {t("table.add")}
        </Button>
      </div>
    </div>
  );
}
