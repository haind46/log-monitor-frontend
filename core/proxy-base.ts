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

// New InternalProxyBase for Next.js API routes
export class InternalProxyBase {
  async get({ requestConfig, outputSchema }: GetMethod) {
    const res = await fetch(requestConfig.url + (requestConfig.params ? '?' + new URLSearchParams(requestConfig.params).toString() : ''), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
    })
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    
    const data = await res.json()
    return { data }
  }

  async post({ requestConfig, outputSchema }: PostMethod) {
    const url = requestConfig.url + (requestConfig.params ? '?' + new URLSearchParams(requestConfig.params).toString() : '')
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      body: requestConfig.data ? JSON.stringify(requestConfig.data) : undefined,
    })
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    
    const data = await res.json()
    return { data }
  }

  async put({ requestConfig, outputSchema }: PutMethod) {
    const url = requestConfig.url + (requestConfig.params ? '?' + new URLSearchParams(requestConfig.params).toString() : '')
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      body: requestConfig.data ? JSON.stringify(requestConfig.data) : undefined,
    })
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    
    const data = await res.json()
    return { data }
  }

  async delete({ requestConfig, outputSchema }: DeleteMethod) {
    const url = requestConfig.url + (requestConfig.params ? '?' + new URLSearchParams(requestConfig.params).toString() : '')
    
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
    })
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    
    const data = await res.json()
    return { data }
  }
}