"use client";

import dynamic from "next/dynamic";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getLogEntryWithParam } from '~/core/api/log-entry';
import { useQuery } from '@tanstack/react-query';
import { DataTableRowActions } from './table-action-row';
import { getSession, signIn, signOut } from 'next-auth/react'

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function LogEntryTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedUserIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);
  const advancedSearch = useStore((store) => store.advancedSearch); // Lấy advancedSearch từ store
  

  const { data: response, isLoading, error, isFetching } = useQuery({
    queryKey: ['getListLogEntry', searchKeyword, advancedSearch, current, pageSize],
    queryFn: async () => {
            // Lấy session để lấy token
      const session = await getSession();
      const token = session?.access_token;
      
      const res = await fetch(
        `/api/log/filter?page=${current}&limit=${pageSize}&keyWord=${encodeURIComponent(searchKeyword ?? "")}&sort_key=id&sort_dir=desc`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),

          },
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(advancedSearch || {}).map(([k, v]) => [k, v === null ? undefined : v])
            )
          ),
        }
      );
      return res.json();
    },
  });

  const t = useTranslations("log-entry");

  const columns = [
    {
      title: t("table.severity"),
      dataIndex: "severity",
      key: "severity",
    },
    {
      title: t("table.occurredAt"),
      dataIndex: "occurredAt",
      key: "occurredAt",
    },
    {
      title: t("table.alarmDate"),
      dataIndex: "alarmDate",
      key: "alarmDate",
    },
    {
      title: t("table.ancestry"),
      dataIndex: "ancestry",
      key: "ancestry",
    },
    {
      title: t("table.systemName"),
      dataIndex: "systemName",
      key: "systemName",
    },
    {
      title: t("table.hostName"),
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: t("table.hostIp"),
      dataIndex: "hostIp",
      key: "hostIp",
    },
    {
      title: t("table.resourceName"),
      dataIndex: "resourceName",
      key: "resourceName",
    },
    {
      title: t("table.target"),
      dataIndex: "target",
      key: "target",
    },
    {
      title: t("table.resourceType"),
      dataIndex: "resourceType",
      key: "resourceType",
    },
    {
      title: t("table.alarmName"),
      dataIndex: "alarmName",
      key: "alarmName",
    },
    {
      title: t("table.conditionLog"),
      dataIndex: "conditionLog",
      key: "conditionLog",
    },
    {
      title: t("table.eventType"),
      dataIndex: "eventType",
      key: "eventType",
    },
    {
      title: t("table.eventSource"),
      dataIndex: "eventSource",
      key: "eventSource",
    },
    {
      title: t("table.eventDetail"),
      dataIndex: "eventDetail",
      key: "eventDetail",
    },
    {
      title: t("table.errorType"),
      dataIndex: "errorType",
      key: "errorType",
    },
    {
      title: t("table.translatedDetail"),
      dataIndex: "translatedDetail",
      key: "translatedDetail",
    },
    {
      title: t("table.analyzedBy"),
      dataIndex: "analyzedBy",
      key: "analyzedBy",
    },
    {
      title: t("table.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: t("table.updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
    }
  ];

  return (
    <Table
      bordered
      rowKey="id"
      loading={isLoading || isFetching}
      dataSource={response?.data?.data}
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
        total: response?.data?.total,
        onChange(page, pageSize) {
          useStore.getState().setPagination(page, pageSize);
        },
      }}
    />
  );
}

