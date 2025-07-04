"use client";

import dynamic from "next/dynamic";
import { useStore } from "~/app/[locale]/(dashboard)/users/store";
import { useTranslations } from "next-intl";
import { getListUser } from "~/core/api/user";
import { useQuery } from "@tanstack/react-query";
import { DataTableRowActions } from "./table-action-row";
import { getSession, signIn, signOut } from 'next-auth/react'

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function UserTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);

  const { data: response, isLoading, error, isFetching } = useQuery({
    queryKey: ['getListUser', searchKeyword],
    queryFn: async () => {
            // Lấy session để lấy token
      const session = await getSession();
      const token = session?.access_token;
      
      const res = await fetch(
        `/api/user?page=${current}&limit=${pageSize}&keyWord=${encodeURIComponent(searchKeyword ?? "")}&sort_key=id&sort_dir=desc`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        }
      );
      return res.json();
    },
  });

  const t = useTranslations("users");

  const columns = [
    {
      title: `${t("table.userCode")}`,
      dataIndex: "username",
      key: "username",
    },
    {
      title: `${t("table.fullname")}`,
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: `${t("table.department")}`,
      dataIndex: "department",
      key: "department",
      render: (department: any) => department?.name || "",
    },

    {
      title: `${t("table.phone")}`,
      dataIndex: "mobilePhone",
      key: "mobilePhone",
    },
    {
      title: `${t("table.email")}`,
      dataIndex: "email",
      key: "email",
    },
    {
      title: `${t("table.createdAt")}`,
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: `${t("table.userNote")}`,
      dataIndex: "userNote",
      key: "userNote",
    },
    {
      title: `${t("table.functionTitle")}`,
      width: 130,
      render: (_: any, record: any) => <DataTableRowActions row={record} />,
    },
  ];
  return (
    <Table
      bordered
      rowKey="id"
      loading={isLoading || isFetching}
      // dataSource={response?.data.data}
      dataSource={Array.isArray(response?.data?.data) ? response.data.data : []}
      columns={columns}
      rowSelection={{
        selectedRowKeys: selectedUserIds,
        onChange(selectedRowKeys) {
          useStore.getState().setSelectedUserIds(selectedRowKeys);
        },
      }}
      pagination={{
        current,
        pageSize,
        total: response?.data.total,
        onChange(page, pageSize) {
          useStore.getState().setPagination(page, pageSize);
        },
      }}
    />
  );
}
