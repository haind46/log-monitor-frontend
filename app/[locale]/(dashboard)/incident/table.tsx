"use client";

import dynamic from "next/dynamic";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getIncidentList } from "~/core/api/incident";
import { useQuery } from "@tanstack/react-query";
import { DataTableRowActions } from "./table-action-row";

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function IncidentTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getListIncident", searchKeyword],
    queryFn: () =>
      getIncidentList({
        page: current,
        size: pageSize,
        keyword: searchKeyword,
        status: 1,
        sortKey: "incident_time",
        sortDir: "desc",
      }),
  });

  const t = useTranslations("incident");
  const tGlobal = useTranslations("global");

  const columns = [
    {
      title: t("table.incidentCode"),
      dataIndex: "incidentCode",
      key: "incidentCode",
    },
    {
      title: t("table.title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("table.incidentTime"),
      dataIndex: "incidentTime",
      key: "incidentTime",
    },
    {
      title: t("table.resolvedTime"),
      dataIndex: "resolvedTime",
      key: "resolvedTime",
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: t("table.severity"),
      dataIndex: "severity",
      key: "severity",
    },
    {
      title: t("table.sourceSystem"),
      dataIndex: "sourceSystem",
      key: "sourceSystem",
    },
    {
      title: t("table.detectedBy"),
      dataIndex: "detectedBy",
      key: "detectedBy",
    },
    {
      title: t("table.assignedTo"),
      dataIndex: "assignedTo",
      key: "assignedTo",
    },
    {
      title: t("table.solution"),
      dataIndex: "solution",
      key: "solution",
    },
    {
      title: t("table.relatedProcedure"),
      dataIndex: "relatedProcedure",
      key: "relatedProcedure",
    },
    {
      title: t("table.suggestion"),
      dataIndex: "suggestion",
      key: "suggestion",
    },
    {
      title: t("table.functionTitle"),
      width: 130,
      render: (_: any, record: any) => <DataTableRowActions row={record} />,
    },
  ];

  return (
    <Table
      bordered
      rowKey="id"
      loading={isLoading || isFetching}
      dataSource={response?.data?.data}
      columns={columns}
      rowSelection={{
        selectedRowKeys: selectedIds,
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
