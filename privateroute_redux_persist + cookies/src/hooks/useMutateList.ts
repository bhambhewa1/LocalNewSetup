import { HttpVerb, makeApiCall } from '@/API/APICall'
import { queryClient } from '@/components/GlobalQueryClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type ApiDataProp = {
  method: HttpVerb
  url: string
  payload?: any
  contentType?: string
  configParam?: any
}

type mutationBodyProps = {
  ModuleName: string
  ApiData: ApiDataProp
  ItemId?: string
  OtherEffectedModules?: string[]
}

const apiCall = async ({ ApiData, ItemId }: { ApiData: ApiDataProp; ItemId?: string }): Promise<any> => {
  const { status, data } = await makeApiCall(
    ApiData.method,
    ApiData.url,
    ApiData?.payload,
    ApiData?.contentType,
    ApiData?.configParam
  )
  if (!status) {
    throw data?.message
  }
  return data
}

const useMutateList = () => {
  const mutation = useMutation({
    mutationFn: ({ ModuleName, ApiData, ItemId, OtherEffectedModules }: mutationBodyProps) =>
      apiCall({ ApiData, ItemId }),
    onSuccess: (updatedResult: any, variables) => {
      const { ModuleName, ItemId, OtherEffectedModules } = variables

      // invalidate all ModuleName query
      queryClient.invalidateQueries({ queryKey: [ModuleName] })

      if (OtherEffectedModules?.length) {
        OtherEffectedModules.forEach((effectedModule: string) => {
          queryClient.invalidateQueries({ queryKey: [effectedModule] })
        })
      }

      // Invalidate the specific project query to refresh its data
      queryClient.setQueryData([ModuleName, ItemId], updatedResult)

      // toast.success(updatedResult?.message ?? 'Action completed successfully')
      // Navigate to the '/projects' page after the action
      //   navigate(AppRoutes.VIEW_PROJECT + "/" + id);
    }
    // onError: error => {
    // console.error('Action failed:', error)
    // const errors = JSON.parse(JSON.stringify(error))
    // errors.map((err: any) => {
    //   toast.error(err.message)
    // })
    // }
  })

  return mutation
}

export default useMutateList

// import { makeApiCall } from '@/API/APICall'
// import { queryClient } from '@/components/GlobalQueryClient';
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'react-toastify'

// const updateData = async ({ apiData, ItemId }: { apiData: any; ItemId?: string }): Promise<any> => {
//   // const finalUrl = ItemId ? `${apiData.url}/${ItemId}` : apiData.url // Append ID if provided
//   // const { hasErrors, status, data, sessionId, errors } = await makeApiCall(
//   //   apiData.method,
//   //   finalUrl,
//   //   apiData?.payload,
//   //   apiData?.contentType
//   // )

//   const { hasErrors, status, data, sessionId, errors } = await makeApiCall(
//     apiData.method,
//     apiData.url,
//     apiData?.payload,
//     apiData?.contentType,
//     apiData?.configParam
//   )

//   if (hasErrors) {
//     throw errors
//   }
//   return data
// }

// const useMutateList = () => {
//   // const queryClient = useQueryClient()

//   const mutation = useMutation({
//     mutationFn: ({ ModuleName, apiData, ItemId }: { ModuleName: string; apiData: any; ItemId?: string }) =>
//       updateData({ apiData, ItemId }),
//     onSuccess: (updatedResult: any, variables) => {
//       const { ModuleName, ItemId } = variables

//       // invalidate all ModuleName query
//       queryClient.invalidateQueries({ queryKey: [ModuleName] })

//       // Invalidate the specific project query to refresh its data
//       queryClient.setQueryData([ModuleName, ItemId], updatedResult)

//       // toast.success(updatedResult?.message ?? 'Action completed successfully')

//       // Navigate to the '/projects' page after the action
//       //   navigate(AppRoutes.VIEW_PROJECT + "/" + id);
//     },
//     // onError: error => {
//       // console.error('Action failed:', error)
//       // const errors = JSON.parse(JSON.stringify(error))
//       // errors.map((err: any) => {
//       //   toast.error(err.message)
//       // })
//     // }
//   })

//   return mutation
// }

// export default useMutateList
