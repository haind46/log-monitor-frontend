import { InternalProxyBase } from '../proxy-base'

const UserProxy = new InternalProxyBase()

type getSystem = {
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
}: getSystem) => {
  return UserProxy.get({
    requestConfig: {
      url: '/api/systems',
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

type CreatedSystem = {
  code: string
  name: string
  lelvel1User: string
  lelvel2User: string
  lelvel3User: string
}

export const createNewSystem = (createdSystem: CreatedSystem) =>
  UserProxy.post({
    requestConfig: {
      url: `/api/systems/create`,
      data: {
        ...createdSystem,
      },
    },
  })



export const updateSystem = ({
  id,
  updatedSystem
}: {
  id: string
  updatedSystem: CreatedSystem
}) =>
  UserProxy.post({
    requestConfig: {
      url: `/api/systems/edit?id=${id}`,
      data: {
        ...updatedSystem,
      },
    },
  })


export const deleteListSystem = ({
  ids,
}: {
  ids: string | string[]
}) => 
  UserProxy.post({
    requestConfig: {
      url: `api/systems/delete`,
      params: {
        ids: ids
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  })

  
