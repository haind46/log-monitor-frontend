"use client";

import dynamic from "next/dynamic";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getList } from '~/core/api/waring-config'
import { useQuery } from '@tanstack/react-query'
import { DataTableRowActions } from './table-action-row'

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function SystemTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);

  const { data: response, isLoading, error, isFetching } = useQuery({
    queryKey: ['getListConfig',searchKeyword],
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
 
  const t = useTranslations("config");

  const columns = [
    {
      title: `${t("table.keyName")}`,
      dataIndex: "keyName",
      key: "keyName",
    },
    {
      title: `${t("table.value")}`,
      dataIndex: "value",
      key: "value",
    },
    {
      title: `${t("table.description")}`,
      key: "description",
      dataIndex: "description",
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

