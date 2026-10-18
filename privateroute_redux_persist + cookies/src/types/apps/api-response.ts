export const ResponseStatus = {
  Failure: false,
  Success: true
}

export interface ApiResponse {
  status: boolean
  data: any
  statusCode: number
  message: string | string[]
}
