import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ApiResponse, ResponseStatus } from '@/types/apps/api-response'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { persistor, store } from '@/redux-store'
import { clearLoggedUser } from '@/redux-store/slices/loggedInUserSlice'
// import { isNil, omitBy } from 'lodash';

// export const API_TIMEOUT = 60000;

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// Add an Axios interceptor after response from backend to handle token expiration
axios.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, handle logout here
      // Clear redux-persist state and reset Redux slice
      store.dispatch(clearLoggedUser())
      // await persistor.purge()
      Cookies.remove('userToken')
      Cookies.remove('role')

      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

const axiosConfig = <Params = undefined>(params?: Params) => ({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URI,
  timeout: 0,
  headers: {
    Authorization: `Bearer ${Cookies.get('userToken')}`
  },
  params
  //   // need to check for this any type in queryParams
  //   paramsSerializer(queryParams: Params | any) {
  //     const paramsWithValues = omitBy(queryParams, isNil);

  //     return Object.entries(paramsWithValues)
  //       .flatMap(([key, value]) => {
  //         if (Array.isArray(value)) {
  //           return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
  //         }
  //         return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  //       })
  //       .join('&');
  //   },
})

const getApiResponseUsingRequestVerb = async <RequestData, ResponseData, Params = undefined, Data = undefined>(
  requestVerb: HttpVerb,
  endpoint: string,
  requestData?: RequestData,
  contentType?: string,
  configParam?: {
    params?: Params
    data?: Data
  }
): Promise<AxiosResponse<ResponseData, RequestData> | null> => {
  const { params, data } = configParam || {}
  const config = axiosConfig<Params>(params)

  if (contentType) {
    const header = { ...config.headers, 'Content-Type': contentType }
    config.headers = header
  }

  switch (requestVerb) {
    case HttpVerb.GET:
      return axios.get(endpoint, config)
    case HttpVerb.POST:
      return axios.post(endpoint, requestData, config)
    case HttpVerb.PUT:
      return axios.put(endpoint, requestData, config)
    case HttpVerb.PATCH:
      return axios.patch(endpoint, requestData, config)
    case HttpVerb.DELETE:
      return axios.delete(endpoint, { ...config, data: requestData })
    // return axios.delete(endpoint, { ...config, data })
    default: {
      return Promise.resolve(null)
    }
  }
}

export const makeApiCall = async <RequestData, ResponseData extends ApiResponse, Params = undefined, Data = undefined>(
  requestVerb: HttpVerb,
  endpoint: string,
  requestData?: RequestData,
  contentType?: string,
  configParam?: {
    params?: any
    data?: Data
  }
): Promise<ApiResponse> => {
  try {
    const response = await getApiResponseUsingRequestVerb<RequestData, ResponseData, Params, Data>(
      requestVerb,
      endpoint,
      requestData,
      contentType,
      configParam
    )
    if (response?.data) {
      if (response?.data?.status) {
        return response?.data
      } else {
        throw new Error(JSON.stringify(response?.data))
      }

      // if (!response?.data?.status) {
      //   if(response?.data?.hasErrors) {
      //     response?.data?.errors?.forEach(item => toast.error(item.message))
      //   } else {
      //     toast.error("Unexpected Error!")
      //   }
      // } else {
      // return response?.data
      // }
      // return mapAxiosResponseToLocalResponseType<RequestData, ResponseData>(response)
    } else {
      // May be we need to return specific error messages in future.
      throw new Error('Unexpected Error!!')
      // toast.error('Unexpected Error!!')
    }
  } catch (exception: any) {
    // console.error('API Error:', exception?.message)

    // Check if backend error exists
    const backendError = exception?.response?.data ?? exception
    let parsedError
    // Check if exception.message is a JSON string and parse it
    try {
      parsedError = JSON.parse(JSON.stringify(backendError))
    } catch (error) {
      parsedError = null
    }

    // If parsedError has valid error structure, extract and show errors
    if (parsedError?.message) {
      if (Array.isArray(parsedError.message)) parsedError.message.forEach((item: string) => toast.error(item))
      else toast.error(parsedError.message)
      return parsedError
    }

    // Default fallback error response
    const fallbackError = {
      statusCode: 500,
      data: null,
      status: ResponseStatus.Failure,
      message: 'Unexpected Error!'
    }
    toast.error(fallbackError.message)

    return fallbackError
  }
}
