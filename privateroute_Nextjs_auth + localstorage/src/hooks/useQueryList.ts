import { HttpVerb, makeApiCall } from '@/API/APICall'
import { useQuery } from '@tanstack/react-query'

type queryBodyProps = {
  ModuleName: string
  ApiData: ApiDataProp
  isSingleItemFetch?: boolean
  ItemId?: string
  Enabled?: boolean
  staleTime?: number
}

type ApiDataProp = {
  url: string
  contentType?: string
  configParam?: any
}

const getData = async (ApiData: ApiDataProp) => {
  let updateconfig = {}
  if (ApiData.configParam?.params) {
    const updatedFilters = Object.fromEntries(
      Object.entries(ApiData?.configParam?.params).filter(([_, value]) => value !== '')
    )
    updateconfig = { params: updatedFilters }
  }

  const { status, data } = await makeApiCall(
    HttpVerb.GET,
    ApiData.url,
    {},
    ApiData?.contentType,
    ApiData?.configParam ? updateconfig : ApiData?.configParam
  )
  if (!status) {
    throw data?.message
  }
  return data
}

const useQueryList = (props: queryBodyProps) => {
  const { ModuleName, ApiData, isSingleItemFetch, ItemId, staleTime, Enabled = true } = props

  return useQuery({
    queryKey: isSingleItemFetch ? [ModuleName, ItemId] : [ModuleName, ApiData?.configParam], // Use ItemId in queryKey if isSingleItemFetch is true, so it will not return the reponse for all items
    queryFn: () => getData(ApiData),
    staleTime,
    // retry: 2,
    enabled: Enabled && Boolean(isSingleItemFetch) === Boolean(ItemId) // Only fetch when `enabled` is true
  })
}

export default useQueryList

// import { HttpVerb, makeApiCall } from '@/API/APICall'
// import data from '@/data/searchData'
// import { useQuery } from '@tanstack/react-query'

// interface FetchDataProps {
//   ModuleName: string
//   APIurl: string
//   enabled?: boolean
//   isSingleItemFetch?: boolean
//   ItemId?: string
//   staleTime?: number
//   contentType?: string
//   configParam?: any
// }

// const getData = async (APIurl: string, contentType?: string, configParam?: any) => {
//   const { hasErrors, status, data, sessionId, errors } = await makeApiCall(HttpVerb.GET, APIurl, {}, contentType, configParam)

//   // const finalUrl = ItemId ? `${APIurl}/${ItemId}` : APIurl // Append ID if provided
//   // const { hasErrors, status, data, sessionId, errors } = await makeApiCall(HttpVerb.GET, APIurl, {}, 'application/json', { params: { id: ItemId }} )

//   if (hasErrors) {
//     throw errors
//   }
//   return data
// }

// const useQueryList = (props: FetchDataProps) => {
//   const { ModuleName, APIurl, staleTime, isSingleItemFetch, ItemId, enabled, contentType, configParam } = props

//   return useQuery({
//     queryKey: isSingleItemFetch ? [ModuleName, ItemId] : [ModuleName], // Use ItemId in queryKey if isSingleItemFetch is true, so it will not return the reponse for all items
//     queryFn: () => getData(APIurl, contentType, configParam),
//     staleTime,
//     enabled // Only fetch when `enabled` is true
//   })
// }

// export default useQueryList
