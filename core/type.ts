import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
export interface RequestConfig extends AxiosRequestConfig {
  url: string
}
export interface GetMethod {
  requestConfig: RequestConfig
  outputSchema?: z.ZodType
}
export interface PostMethod {
  requestConfig: RequestConfig
  outputSchema?: z.ZodType
}

export interface PutMethod extends PostMethod {}

export interface DeleteMethod extends PostMethod {}
