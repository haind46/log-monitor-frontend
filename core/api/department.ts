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
      url: '/api/department',
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

type Department = {
  name: string
  deptCode: string
  desc: string
}

export const createDepartment = (departmentData: Department) =>
  UserProxy.post({
    requestConfig: {
      url: `api/department/create`,
      data: {
        ...departmentData,
      },
    },
  })



export const updateDepartment = ({
  id,
  updatedDepartment: configData
}: {
  id: string
  updatedDepartment: Department
}) =>
  UserProxy.post({
    requestConfig: {
      url: `api/department/edit?id=${id}`,
      data: {
        ...configData,
      },
    },
  })


export const deleteListDepartment = ({
  ids,
}: {
  ids: string | string[]
}) => 
  UserProxy.post({
    requestConfig: {
      url: `api/department/delete`,
      params: {
        ids: ids
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  })

  
