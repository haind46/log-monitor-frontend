"use client";

import dynamic from "next/dynamic";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getList } from '~/core/api/system'
import { useQuery } from '@tanstack/react-query'
import { DataTableRowActions } from './table-action-row'
import { getSession, signIn, signOut } from 'next-auth/react'

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function SystemTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);

  const { data: response, isLoading, error, isFetching } = useQuery({
    queryKey: ['getListSystem', searchKeyword],
    queryFn: async () => {
            // Lấy session để lấy token
      const session = await getSession();
      const token = session?.access_token;
      
      const res = await fetch(
        `/api/system?page=${current}&limit=${pageSize}&keyWord=${encodeURIComponent(searchKeyword ?? "")}&sort_key=id&sort_dir=desc`,
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
 
  const t = useTranslations("system");

  const columns = [
    {
      title: `${t("table.codeSystem")}`,
      dataIndex: "code",
      key: "code",
    },
    {
      title: `${t("table.nameSystem")}`,
      dataIndex: "name",
      key: "name",
    },
    {
      title: `${t("table.level1")}`,
      key: "level1",
      render: (text: any, record: any) => (
        <div className="space-y-1"> 
          <div className="text-gray-500">{record.level1User?.username || "-"}</div>
          <div className="text-gray-500">{record.level1User?.department?.name || "-"}</div>
          <div className="text-gray-500">{record.level1User?.mobilePhone || "-"}</div>
        </div>
      )
    },
    {
      title: `${t("table.level2")}`,
      key: "level2",
      render: (text: any, record: any) => (
        <div className="space-y-1"> 
          <div className="text-gray-500">{record.level2User?.username || "-"}</div>
          <div className="text-gray-500">{record.level2User?.department?.name || "-"}</div>
          <div className="text-gray-500">{record.level2User?.mobilePhone || "-"}</div>
        </div>
      )
    },
    {
      title: `${t("table.level3")}`,
      key: "level3",
      render: (text: any, record: any) => (
        <div className="space-y-1"> 
          <div className="text-gray-500">{record.level3User?.username || "-"}</div>
          <div className="text-gray-500">{record.level3User?.department?.name || "-"}</div>
          <div className="text-gray-500">{record.level3User?.mobilePhone || "-"}</div>
        </div>
      )
    },
    {
      title: `${t("table.createdAt")}`,
      dataIndex: "createdAt",
      key: "createdAt",
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
        total: response?.data.total ?? 0,
        onChange(page, pageSize) {
          useStore.getState().setPagination(page, pageSize);
        },
      }}
    />
  );
}

