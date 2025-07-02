import { Key } from "react";
import { create } from "zustand";
import { User } from './schema'
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
  editUserGroupData: User | undefined
  setIsOpenSheet: (isOpenSheet: boolean) => void
  setMode: (mode: Mode) => void
  setEditUserGroupData: (editUserGroupData: User | undefined) => void
  
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
  editUserGroupData: undefined,
  setIsOpenSheet: (isOpenSheet: boolean) => set({ isOpenSheet }),
  setMode: (mode: Mode) => set({ mode }),
  setEditUserGroupData: (editUserGroupData: User | undefined) =>
    set({ editUserGroupData }),
}));
