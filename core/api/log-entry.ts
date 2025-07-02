import ProxyBase from "../proxy-base";

const UserProxy = new ProxyBase();

type LogEntryRequest = {
  severity?: string;
  occurredAtFrom?: string; // ISO string
  occurredAtTo?: string; // ISO string
  systemName?: string;
  hostName?: string;
  hostIp?: string;
  resourceName?: string;
  resourceType?: string;
  alarmName?: string;
  eventType?: string;
  eventSource?: string;
  errorType?: string;
  analyzedBy?: string;
};

type getLogEntryWithParamConfig = {
  page?: number;
  limit?: number;
  keyWord?: string;
  sortDir?: string;
  sortKey?: string;
  logEntryRequest: LogEntryRequest;
};

export const getLogEntryWithParam = ({
  page = 1,
  limit = 10,
  keyWord,
  sortDir = "desc",
  sortKey = "id",
  logEntryRequest,
}: getLogEntryWithParamConfig) => {
  return UserProxy.post({
    requestConfig: {
      url: "/api/log/filter",
      params: {
        page,
        limit,
        keyWord,
        sort_dir: sortDir,
        sort_key: sortKey,
      },
      data: logEntryRequest,
    },
  });
};
