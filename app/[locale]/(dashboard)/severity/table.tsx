"use client";

import dynamic from "next/dynamic";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getList } from '~/core/api/severity'
import { useQuery } from '@tanstack/react-query'
import { DataTableRowActions } from './table-action-row'

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function SystemTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);

  const { data: response, isLoading, error, isFetching } = useQuery({
    queryKey: ['getListSeverity',searchKeyword],
    queryFn: () =>
      getList({
        page: current,
        size: pageSize,
        keyword: searchKeyword,
        status : 1,
        sortKey:'id',
        sortDir:'desc'
      }),
  })
 
  const t = useTranslations("severity");

  const columns = [
    {
      title: `${t("table.severityLevel")}`,
      dataIndex: "severityLevel",
      key: "severityLevel",
    },
    {
      title: `${t("table.description")}`,
      dataIndex: "description",
      key: "description",
    },
    {
      title: `${t("table.notifyToLevel")}`,
      key: "notifyToLevel",
      dataIndex: "notifyToLevel",
      render: (value: number) => value ?? "",
    },
    {
      title: `${t("table.autoCall")}`,
      key: "autoCall",
      dataIndex: "autoCall",
      render: (value: boolean) => value ? "Yes" : "No",
    },
    {
      title: `${t("table.ttsTemplate")}`,
      key: "ttsTemplate",
      dataIndex: "ttsTemplate",
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
      dataSource={response?.data.data}
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

