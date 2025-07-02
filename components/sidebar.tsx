"use client";

import {
  Building,
  LayoutGrid,
  Radio,
  Settings,
  User2Icon,
  Users,
  Server,
  SatelliteDish,
  AlarmClock,
  ClipboardList,
  Search,
  Workflow,
  Rss,
  ChartArea,
  ChartNoAxesCombined,
} from "lucide-react";
import Link from "next-intl/link";
import { usePathname } from "next/navigation"; // Import usePathname

import { HTMLAttributes } from "react";
import { Button } from "~/components/ui/button";

import { useTranslations } from "next-intl";

export default function Sidebar({ className }: HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname(); // Get the current route
  const currentRoute = pathname.split("/").pop();
  const t = useTranslations("Sidebar");

  return (
    <div className={className}>
      <div className="space-y-2 py-4">
        <div className="px-2 py-0">
          <div className="flex items-center mb-2 mt-4">
            <span className="inline-block h-4 w-1 rounded-full bg-sky-600 mr-2"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 opacity-90 select-none">
              {t("groups.accessControl")}
            </h2>
          </div>
          <div className="space-y-0">
            <Button
              variant={currentRoute === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/users" className="flex w-full">
                <User2Icon className="mr-2 h-4 w-4" />
                {t("items.userManagement")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "department" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/department" className="flex w-full">
                <Building className="mr-2 h-4 w-4" />
                {t("items.department")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "system" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/system" className="flex w-full">
                <Server className="mr-2 h-4 w-4" />
                {t("items.systemLog")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "config" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/config" className="flex w-full">
                <Settings className="mr-2 h-4 w-4" />
                {t("items.settings")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "severity" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/severity" className="flex w-full">
                <Rss className="mr-2 h-4 w-4" />
                {t("items.severity")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-2 py-0">
          <div className="flex items-center mb-2 mt-4">
            <span className="inline-block h-4 w-1 rounded-full bg-sky-600 mr-2"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 opacity-90 select-none">
              {t("groups.alarmEvent")}
            </h2>
          </div>
          <div className="space-y-0">
            <Button
              variant={currentRoute === "workflow" ? "secondary" : "ghost"}
              className="w-full justify-start pl-4"
            >
              <Link
                href="/under-construction"
                className="flex items-center w-full text-left"
              >
                <Workflow className="mr-2 h-5 w-5" />
                {t("items.workflow")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "incident" ? "secondary" : "ghost"}
              className="w-full justify-start pl-4"
            >
              <Link
                href="/incident"
                className="flex items-center w-full text-left"
              >
                <AlarmClock className="mr-2 h-5 w-5" />
                {t("items.incident")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "system-cr-log" ? "secondary" : "ghost"}
              className="w-full justify-start pl-4"
            >
              <Link
                href="/system-cr-log"
                className="flex items-center w-full text-left"
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                {t("items.logCR")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "log-entry" ? "secondary" : "ghost"}
              className="w-full justify-start pl-4"
            >
              <Link
                href="/log-entry"
                className="flex items-center w-full text-left"
              >
                <Search className="mr-2 h-5 w-5" />
                {t("items.eventLookup")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-2 py-0">
          <div className="flex items-center mb-2 mt-4">
            <span className="inline-block h-4 w-1 rounded-full bg-sky-600 mr-2"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 opacity-90 select-none">
              {t("groups.report")}
            </h2>
          </div>
          <div className="space-y-0">
            <Button
              variant={currentRoute === "workflow" ? "secondary" : "ghost"}
              className="w-full justify-start pl-4"
            >
              <Link
                href="/under-construction"
                className="flex items-center w-full text-left"
              >
                <ChartArea className="mr-2 h-5 w-5" />
                {t("items.reportCountingAlarm")}
              </Link>
            </Button>

            <Button
              variant={currentRoute === "workflow" ? "secondary" : "ghost"}
              className="w-full justify-start pl-4"
            >
              <Link
                href="/under-construction"
                className="flex items-center w-full text-left"
              >
                <ChartNoAxesCombined className="mr-2 h-5 w-5" />
                {t("items.reportReceiveCallAlarm")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
