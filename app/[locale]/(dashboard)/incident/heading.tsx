"use client";

import { PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "./store";
import { confirm } from "~/components/comfirm";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { deleteListIncident } from "~/core/api/incident";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function IncidentHeading() {
  const t = useTranslations("incident");
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

  // Xử lý xóa nhiều bản ghi
  const deleteMutation = useMutation({
    mutationFn: deleteListIncident,
    onSuccess() {
      toast({
        title: t("form.success") || "Success",
      });
      queryClient.invalidateQueries({
        queryKey: ["getListIncident"],
      });
    },
    onError(error: any) {
      toast({
        variant: "destructive",
        title: error?.message || t("form.error") || "Error",
      });
    },
  });

  function deleteIncidents() {
    confirm({
      title: t("form.mutipleDelete") || "Delete selected",
      description: `(${selectedUserIds.length}) ` + (t("form.mutipleDeleteTitle") || "Are you sure you want to delete these incidents?"),
      async onOk() {
        await deleteMutation.mutateAsync({
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
      <div className="font-bold text-xl">{t("main-nav.manageIncident")}</div>
      <div className="flex items-center">
        {selectedUserIds.length > 0 && (
          <Button variant="destructive" onClick={deleteIncidents}>
            <TrashIcon size={18} className="mr-2" />
            {t("form.delete") || "Delete"} ({selectedUserIds.length})
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
          <PlusCircleIcon size={18} className="mr-2" />{" "}
          {t("table.add") || "Add incident"}
        </Button>
      </div>
    </div>
  );
}
