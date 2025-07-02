import axiosInstance from './axios-interceptors'
import { handleAxiosError } from './helper'
import { DeleteMethod, GetMethod, PostMethod, PutMethod } from './type'

export default class ProxyBase {
  async get({ requestConfig, outputSchema }: GetMethod) {
    const res = await axiosInstance.get(requestConfig.url, {
      ...requestConfig,
    })
    return handleAxiosError(res, outputSchema)
  }

  async post({ requestConfig, outputSchema }: PostMethod) {
    const res = await axiosInstance.post(
      requestConfig.url,
      requestConfig.data,
      { ...requestConfig },
    )
    return handleAxiosError(res, outputSchema)
  }

  async put({ requestConfig, outputSchema }: PutMethod) {
    const res = await axiosInstance.put(requestConfig.url, requestConfig.data, {
      ...requestConfig,
    })

    return handleAxiosError(res, outputSchema)
  }

  async delete({ requestConfig, outputSchema }: DeleteMethod) {
    const res = await axiosInstance.delete(requestConfig.url, {
      ...requestConfig,
    })
    return handleAxiosError(res, outputSchema)
  }
}
