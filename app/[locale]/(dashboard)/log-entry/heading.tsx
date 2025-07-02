"use client";

import { SearchIcon, FilterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "./store";
import { useState } from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function LogEntryHeading() {
  const t = useTranslations("log-entry");
  const tGlobal = useTranslations("global");

  const searchKeyword = useStore((store) => store.searchKeyword);
  const setSearchKeyword = useStore((store) => store.setSearchKeyword);

  // State cho search nâng cao
  const [advancedSearch, setAdvancedSearch] = useState({
    severity: "",
    occurredAtFrom: "",
    occurredAtTo: "",
    systemName: "",
    hostName: "",
    hostIp: "",
    resourceName: "",
    resourceType: "",
    alarmName: "",
    eventType: "",
    eventSource: "",
    errorType: "",
    analyzedBy: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [occurredAtRange, setOccurredAtRange] = useState<
    [string, string] | null
  >(null);

  // Hàm xử lý khi nhấn Enter cho search thường
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchKeyword((event.target as HTMLInputElement).value);
    }
  };

  // Hàm xử lý khi nhấn nút tìm kiếm nâng cao
  const handleAdvancedSearch = () => {
    useStore.getState().setAdvancedSearch({
      id: "", // Provide a suitable id value here
      ...advancedSearch,
      occurredAtFrom: occurredAtRange?.[0] || "",
      occurredAtTo: occurredAtRange?.[1] || "",
    });
    setShowAdvanced(false);
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      <div className="font-bold text-xl">
        {t("main-nav.logEntry") || "Log Entry"}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder={tGlobal("filter")}
            defaultValue={searchKeyword}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-2 py-1"
          />
          <SearchIcon
            size={18}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>
        <Button
          type="button"
          className="ml-2 flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          variant="outline"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <FilterIcon size={18} className="mr-1" />
          {t("table.advancedSearch") || "Advanced Search"}
        </Button>
      </div>
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 bg-gray-50 p-4 rounded border">
          <Input
            placeholder={t("table.severity")}
            value={advancedSearch.severity}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, severity: e.target.value }))
            }
          />
          <div className="md:col-span-1 col-span-1">
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              value={
                occurredAtRange && occurredAtRange[0] && occurredAtRange[1]
                  ? [dayjs(occurredAtRange[0]), dayjs(occurredAtRange[1])]
                  : undefined
              }
              onChange={(dates, dateStrings) =>
                setOccurredAtRange(dateStrings as [string, string])
              }
              style={{ width: "100%" }}
              placeholder={[t("table.occurredAtFrom"), t("table.occurredAtTo")]}
            />
          </div>
          <Input
            placeholder={t("table.systemName")}
            value={advancedSearch.systemName}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, systemName: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.hostName")}
            value={advancedSearch.hostName}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, hostName: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.hostIp")}
            value={advancedSearch.hostIp}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, hostIp: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.resourceName")}
            value={advancedSearch.resourceName}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, resourceName: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.resourceType")}
            value={advancedSearch.resourceType}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, resourceType: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.alarmName")}
            value={advancedSearch.alarmName}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, alarmName: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.eventType")}
            value={advancedSearch.eventType}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, eventType: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.eventSource")}
            value={advancedSearch.eventSource}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, eventSource: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.errorType")}
            value={advancedSearch.errorType}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, errorType: e.target.value }))
            }
          />
          <Input
            placeholder={t("table.analyzedBy")}
            value={advancedSearch.analyzedBy}
            onChange={(e) =>
              setAdvancedSearch((s) => ({ ...s, analyzedBy: e.target.value }))
            }
          />
          <Button
            className="col-span-1 md:col-span-3"
            type="button"
            onClick={handleAdvancedSearch}
          >
            {t("table.advancedSearch") || "Advanced Search"}
          </Button>
        </div>
      )}
    </div>
  );
}
