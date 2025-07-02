"use client";

import dynamic from "next/dynamic";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getList } from "~/core/api/systemCrLog";
import { useQuery } from "@tanstack/react-query";
import { DataTableRowActions } from "./table-action-row";

const Table = dynamic(() => import("antd/es/table"), { ssr: false });

export default function SystemCrLogTable() {
  const current = useStore((store) => store.page);
  const pageSize = useStore((store) => store.pageSize);
  const selectedIds = useStore((store) => store.selectedUserIds);
  const searchKeyword = useStore((store) => store.searchKeyword);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getListSystemCrLog", searchKeyword],
    queryFn: () =>
      getList({
        page: current,
        size: pageSize,
        keyword: searchKeyword,
        status: 1,
        sortKey: "id",
        sortDir: "desc",
      }),
  });

  const t = useTranslations("system-cr-log");
  const tGlobal = useTranslations("global");

  const columns = [
    {
      title: t("table.startTime"),
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: t("table.endTime"),
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: t("table.impactedSystem"),
      dataIndex: "impactedSystem",
      key: "impactedSystem",
    },
    {
      title: t("table.sourceSystem"),
      dataIndex: "sourceSystem",
      key: "sourceSystem",
    },
    {
      title: t("table.relatedSystems"),
      dataIndex: "relatedSystems",
      key: "relatedSystems",
      render: (relatedSystems: string[]) =>
        Array.isArray(relatedSystems) ? relatedSystems.join(", ") : "",
    },
    {
      title: t("table.implementUnit"),
      dataIndex: "implementUnit",
      key: "implementUnit",
    },
    {
      title: t("table.implementer"),
      dataIndex: "implementer",
      key: "implementer",
    },
    {
      title: t("table.approver"),
      dataIndex: "approver",
      key: "approver",
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string | number) =>
        String(status) === "1"
          ? tGlobal("active") || "Hoạt động"
          : tGlobal("disabled") || "Không hoạt động",
    },
    {
      title: t("table.procedureFile"),
      dataIndex: "procedureFile",
      key: "procedureFile",
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("table.note"),
      dataIndex: "note",
      key: "note",
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
