type ModifiedResponse<T = Record<string, unknown>> = {
  statusCode: number
  message?: string
  data?: T
}

export const Get = async <T = Record<string, unknown>>(
  url: string,
  options?: { token?: string },
): Promise<ModifiedResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
    })

    return await handleResponse(res)
  } catch (e) {
    return (await handleError(e)) as ModifiedResponse<T>
  }
}

export const Post = async <T = Record<string, unknown>>(
  url: string,
  options?: { data?: object; token?: string },
): Promise<ModifiedResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: JSON.stringify(options?.data ? options.data : {}),
    })

    return await handleResponse(res)
  } catch (e) {
    return (await handleError(e)) as ModifiedResponse<T>
  }
}

// export const Patch = async <T = Record<string, unknown>>(
//   url: string,
//   options?: { data?: object; token?: string },
// ): Promise<ModifiedResponse<T>> => {
//   try {
//     const res = await fetch(url, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
//       },
//       body: JSON.stringify(options?.data ? options.data : {}),
//     })

//     return handleResponse(res)
//   } catch (e) {
//     return (await handleError(e)) as ModifiedResponse<T>
//   }
// }

const handleResponse = async <T = Record<string, unknown>>(
  response: Response,
): Promise<ModifiedResponse<T>> => {
  if (response.ok) {
    try {
      const result = await response.json()

      return {
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      }
    } catch {
      return { statusCode: 0, message: '' }
    }
  } else {
    throw response
  }
}

const handleError = async (error: unknown): Promise<ModifiedResponse> => {
  if (error instanceof Response) {
    const errorResponse = await error.json()
    try {
      return {
        statusCode: errorResponse.statusCode,
        data: errorResponse.data,
        message: errorResponse.message,
      }
    } catch {
      return { statusCode: error.status, message: '' }
    }
  } else {
    return { statusCode: 0, message: 'Failed to fetch' }
  }
}
