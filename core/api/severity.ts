import { InternalProxyBase } from '../proxy-base'

const UserProxy = new InternalProxyBase()

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
      url: '/api/severity-config',
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


export const getUserById = (id: string) =>
  UserProxy.post({
    requestConfig: {
      url: '/api/user/getInfo',
      params: {
        userId: id,
      },
    },
  })

type Severity = {
  severityLevel: string
  description: string
  notifyToLevel: number
  autoCall: boolean
  ttsTemplate: string
}

export const createSeverity = (severityData: Severity) =>
  UserProxy.post({
    requestConfig: {
      url: `api/severity-config/create`,
      data: {
        ...severityData,
      },
    },
  })



export const updatedSeverity = ({
  id,
  updatedSeverity: configData
}: {
  id: string
  updatedSeverity: Severity
}) =>
  UserProxy.post({
    requestConfig: {
      url: `api/severity-config/edit?id=${id}`,
      data: {
        ...configData,
      },
    },
  })


export const deleteListSeverity = ({
  ids,
}: {
  ids: string | string[]
}) => 
  UserProxy.post({
    requestConfig: {
      url: `api/severity-config/delete`,
      params: {
        ids: ids
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  })

  
