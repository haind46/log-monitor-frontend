import { DataNode } from 'antd/es/tree'

export type Mode = 'create' | 'edit' | 'view' 

export type FunctionNode = {
  id: number
  title: string
  parentId?: number
}

export type FunctionRawNode = {
  id: string
  moduleName: string
  modulePath: string
  parentId: string
  moduleCode: string
  status: number
}

export type HashTableByParentIds = {
  [key: number]: DataNode[]
}
