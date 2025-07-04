// import ProxyBase from '../proxy-base'
// const UserProxy = new ProxyBase()

import { InternalProxyBase } from '../proxy-base'
const UserProxy = new InternalProxyBase()


type GetUserType = {
  page?: number
  size?: number
  keyword?: string
  status?: number
  sortKey?: string
  sortDir?: string
}

// export const getListUser = ({
//   page,
//   size,
//   keyword,
//   status,
//   sortKey,
//   sortDir,
// }: GetUserType) => {
//   return UserProxy.get({
//     requestConfig: {
//       url: '/api/users',
//       params: {
//         page: page ?? '',
//         limit: size ?? '',
//         keyWord: keyword ?? '',
//         status: status ?? 2,
//         sort_key: sortKey ?? '',
//         sort_dir: sortDir ?? '',
//       },
//     },
//   });
// };

export const getListUser = ({
  page,
  size,
  keyword,
  status,
  sortKey,
  sortDir,
}: GetUserType) => {
  return UserProxy.get({
    requestConfig: {
      url: '/api/user',
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
      // url: '/user/getInfo',
      url: '/api/user/getInfo',
      params: {
        userId: id,
      },
    },
  })

type CreatedUser = {
  username: string
  password: string
  fullname: string
  userNote: string
  department: string
  mobilePhone: string
  email: string
  status: number
}

export const createNewUser = (createdUser: CreatedUser) =>
  UserProxy.post({
    requestConfig: {
      // url: `api/users/create`,
      url: `/api/user/create`,
      data: {
        ...createdUser,
      },
    },
  })

type UpdatedUser = {
  username: string
  password: string
  fullname: string
  userNote: string
  department: string
  mobilePhone: string
  email: string
  status: number
}

export const updateUser = ({
  id,
  updatedUser,
}: {
  id: string
  updatedUser: UpdatedUser
}) =>
  UserProxy.post({
    requestConfig: {
      // url: `api/users/edit?id=${id}`,
      url: `/api/user/edit?id=${id}`,
      data: {
        ...updatedUser,
      },
    },
  })


export const deleteListUser = ({
  ids,
}: {
  ids: string | string[]
}) => 
  UserProxy.post({
    requestConfig: {
      // url: `api/users/delete`,
      url: `/api/user/delete`,
      params: {
        ids: ids
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  })

  
