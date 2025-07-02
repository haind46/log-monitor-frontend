// import ProxyBase from '../proxy-base'

// const UserProxy = new ProxyBase()
// const IncidentProxy = new ProxyBase()

import { InternalProxyBase } from '../proxy-base'

const UserProxy = new InternalProxyBase()
const IncidentProxy = new InternalProxyBase()

type getConfig = {
  page?: number
  size?: number
  keyword?: string
  status?: number
  sortKey?: string
  sortDir?: string
}

export const getIncidentList = ({
  page,
  size,
  keyword,
  status,
  sortKey,
  sortDir,
}: getConfig) => {
  return IncidentProxy.get({
    requestConfig: {
      url: '/api/incident',
      params: {
        page: page ?? '',
        limit: size ?? '',
        keyword: keyword ?? '',
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

export const getIncidentById = (id: string) =>
  IncidentProxy.post({
    requestConfig: {
      // url: '/incident/getInfo',
      url: '/api/incident/getInfo',
      params: {
        incidentId: id,
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
      // url: `api/department/create`,
      url: `/api/department/create`,
      data: {
        ...departmentData,
      },
    },
  })

// Incident type based on IncidentRequest DTO from Java
export type Incident = {
  incidentCode?: string
  title: string
  description?: string
  incidentTime: string // ISO string, maps to Java Instant
  resolvedTime?: string // ISO string, maps to Java Instant
  status?: string
  severity?: string
  sourceSystem?: string
  detectedBy?: string
  assignedTo?: string
  solution?: string
  relatedProcedure?: string
  suggestion?: string
}

export const createIncident = (incidentData: Incident) =>
  IncidentProxy.post({
    requestConfig: {
      // url: `api/incident/create`,
      url: `/api/incident/create`,
      data: {
        ...incidentData,
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
      // url: `api/department/edit?id=${id}`,
      url: `/api/department/edit?id=${id}`,
      data: {
        ...configData,
      },
    },
  })

export const updateIncident = ({
  id,
  updatedIncident: configData
}: {
  id: string
  updatedIncident: Incident
}) =>
  IncidentProxy.post({
    requestConfig: {
      // url: `api/incident/edit?id=${id}`,
      url: `/api/incident/edit?id=${id}`,
      data: {
        ...configData,
      },
    },
  })

export const deleteListDepartment = ({
  ids,
}: {
  ids: string | string[]
}) => {
  UserProxy.post({
    requestConfig: {
      // url: `api/department/delete`,
      url: `/api/department/delete`,
      params: {
        ids: ids
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  })
}

export const deleteListIncident = ({
  ids,
}: {
  ids: string | string[]
}) => 
  IncidentProxy.post({
    requestConfig: {
      // url: `api/incident/delete`,
      url: `/api/incident/delete`,
      params: {
        ids: ids
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  })


