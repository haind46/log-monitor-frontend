import ProxyBase from "../proxy-base";

const UserProxy = new ProxyBase();

type getConfig = {
  page?: number;
  size?: number;
  keyword?: string;
  status?: number;
  sortKey?: string;
  sortDir?: string;
};

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
      url: "/api/config",
      params: {
        page: page ?? "",
        limit: size ?? "",
        keyWord: keyword ?? "",
        status: status ?? 2,
        sort_key: sortKey ?? "",
        sort_dir: sortDir ?? "",
      },
    },
  });
};

export const getUserById = (id: string) =>
  UserProxy.post({
    requestConfig: {
      url: "/user/getInfo",
      params: {
        userId: id,
      },
    },
  });

type Config = {
  keyName: string;
  value: string;
  description: string;
};

export const createConfig = (configData: Config) =>
  UserProxy.post({
    requestConfig: {
      url: `api/config/create`,
      data: {
        ...configData,
      },
    },
  });

export const updateConfig = ({
  id,
  updatedConfig: configData,
}: {
  id: string;
  updatedConfig: Config;
}) =>
  UserProxy.post({
    requestConfig: {
      url: `api/config/edit?id=${id}`,
      data: {
        ...configData,
      },
    },
  });

export const deleteListConfig = ({ ids }: { ids: string | string[] }) =>
  UserProxy.post({
    requestConfig: {
      url: `api/config/delete`,
      params: {
        ids: ids,
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  });
