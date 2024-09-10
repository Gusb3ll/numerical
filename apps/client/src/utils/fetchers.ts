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

    return handleResponse(res)
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

    return handleResponse(res)
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
  res: Response,
): Promise<ModifiedResponse<T>> => {
  if (res.ok) {
    try {
      const data = await res.json()

      return {
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
      }
    } catch {
      return { statusCode: 0, message: 'Failed to fetch' }
    }
  } else {
    throw res
  }
}

const handleError = async (err: unknown): Promise<ModifiedResponse> => {
  if (err instanceof Response) {
    const data = await err.json()
    try {
      return {
        statusCode: data.statusCode,
        data: data.data,
        message: data.message,
      }
    } catch {
      return { statusCode: err.status, message: 'Failed to fetch' }
    }
  } else {
    return { statusCode: 0, message: 'Failed to fetch' }
  }
}
