"use client";

import { PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "./store";
import { confirm } from "~/components/comfirm";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { deleteListUser } from "~/core/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UserHeading() {
  const t = useTranslations();
  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const queryClient = useQueryClient();
  const { setMode, setIsOpenSheet, resetSelectedUserIds } = useStore(
    (state) => state
  );
  const searchKeyword = useStore((store) => store.searchKeyword);
  const setSearchKeyword = useStore((store) => store.setSearchKeyword);

  const deleteMutation = useMutation({
    mutationFn: deleteListUser,
    onSuccess(data : any) {
      if (data?.message === "6002") {
        toast({
          title: t("users.form.errorTitle"),
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

  function showCreateForm() {
    setMode("create");
    setIsOpenSheet(true);
  }

  function deleteUsers() {
    confirm({
      title: "Bạn có chắc muốn xóa dữ liệu người dùng ?",
      description: `(${selectedUserIds.length}) người dùng đã được chọn`,
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
      <div className="font-bold text-xl">{t("main-nav.manageUser")}</div>
      <div className="flex items-center">
        {selectedUserIds.length > 0 && (
          <Button variant="destructive" onClick={deleteUsers}>
            <TrashIcon size={18} className="mr-2" />
            Delete ({selectedUserIds.length})
          </Button>
        )}

        {/* Input filter với biểu tượng tìm kiếm */}
        <div className="relative ml-2 flex items-center">
          <input
            type="text"
            placeholder={t("global.filter")}
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
          {t("users.table.addUser")}
        </Button>
      </div>
    </div>
  );
}
