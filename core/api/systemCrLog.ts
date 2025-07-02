import ProxyBase from '../proxy-base'

const UserProxy = new ProxyBase()

type getConfig = {
  page?: number
  size?: number
  keyword?: string
  status?: number
  sortKey?: string
  sortDir?: string
}

export const getList = ({
  page,
  size,
  keyword,
  status,
  sortKey,
  sortDir,
}: getConfig) => {
  return UserProxy.get({
    requestConfig: {
      url: '/api/system-cr-log',
      params: {
        page: page ?? '',
        limit: size ?? '',
        keyWord: keyword ?? '',
        status: status ?? 2,
        sort_key: sortKey ?? '',
        sort_dir: sortDir ?? '',
      },
    },
  });
};

export type SystemCrLog = {
  startTime: string; 
  endTime?: string;
  scope?: string;
  impactedSystem: string;
  implementUnit?: string;
  implementer?: string;
  approver?: string;
  status?: string;
  procedureFile?: string;
  description?: string;
  note?: string;
  sourceSystem?: string;
  relatedSystems?: string[];
};

// Tạo mới SystemCrLog
export const createSystemCrLog = (data: SystemCrLog) =>
  UserProxy.post({
    requestConfig: {
      url: `api/system-cr-log/create`,
      data,
    },
  });

// Cập nhật SystemCrLog
export const updateSystemCrLog = ({
  id,
  updatedSystemCrLog,
}: {
  id: string;
  updatedSystemCrLog: SystemCrLog;
}) =>
  UserProxy.post({
    requestConfig: {
      url: `api/system-cr-log/edit?id=${id}`,
      data: updatedSystemCrLog,
    },
  });

// Xóa danh sách SystemCrLog
export const deleteListSystemCrLog = ({
  ids,
}: {
  ids: string | string[];
}) => 
  UserProxy.post({
    requestConfig: {
      url: `api/system-cr-log/delete`,
      params: {
        ids: ids,
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  });

