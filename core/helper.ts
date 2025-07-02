import { AxiosResponse } from 'axios'
import { z } from 'zod'

export const handleAxiosError = (
  axiosRes: AxiosResponse,
  outputSchema?: z.ZodType,
) => {
  try {
    if (!outputSchema) return axiosRes.data

    const zodObject = outputSchema.safeParse(axiosRes.data)
    if (zodObject.success === false) {
      throw zodObject.error
    }

    return zodObject.data
  } catch (error) {
    throw new Error('Error:' + error)
  }
}
