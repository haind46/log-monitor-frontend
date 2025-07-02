import { Key } from "react";
import { create } from "zustand";
import { Severity as System } from './schema'
import { Mode } from './type'

interface State {
  mode: Mode;
  formMode: "edit" | "view" | "create";
  formOpen: boolean;
  formTargetUserId: string;
  selectedUserIds: Key[];
  searchKeyword : string;
  page: number;
  pageSize: number;
  setPagination: (page: number, pageSize: number) => void;
  setSearchKeyword: (searchKeyword: string) => void;
  setSelectedUserIds: (selectedUserIds: Key[]) => void;
  resetSelectedUserIds: () => void;
  setFormOpen: (formOpen: boolean) => void;
  showEditForm: (userId: string) => void;
  showViewForm: (userId: string) => void;
  showCreateForm: () => void;
  isOpenSheet: boolean
  editSystemData: System | undefined
  setIsOpenSheet: (isOpenSheet: boolean) => void
  setMode: (mode: Mode) => void
  setEditSystemData: (editSystemData: System | undefined) => void
  
}

export const useStore = create<State>((set) => ({
  formMode: "edit",
  formOpen: false,
  selectedUserIds: [],
  searchKeyword : '',
  formTargetUserId: "",
  page: 1,
  pageSize: 10,
  showCreateForm() {
    set({ formMode: "create", formOpen: true, formTargetUserId: "" });
  },
  showEditForm(userId: string) {
    set({ formMode: "edit", formOpen: true, formTargetUserId: userId });
  },
  showViewForm(userId: string) {
    set({ formMode: "view", formOpen: true, formTargetUserId: userId });
  },
  setPagination(page, pageSize) {
    set({ page, pageSize });
  },
  setSelectedUserIds(selectedUserIds) {
    set({ selectedUserIds });
  },
  setSearchKeyword(searchKeyword) {
    set({ searchKeyword });
  },
  resetSelectedUserIds() {
    set({ selectedUserIds: [] });
  },
  setFormOpen(formOpen) {
    set({ formOpen });
  },
  mode: 'create' as const,
  isOpenSheet: false,
  editSystemData: undefined,
  setIsOpenSheet: (isOpenSheet: boolean) => set({ isOpenSheet }),
  setMode: (mode: Mode) => set({ mode }),
  setEditSystemData: (editUserGroupData: System | undefined) =>
    set({ editSystemData: editUserGroupData }),
}));
