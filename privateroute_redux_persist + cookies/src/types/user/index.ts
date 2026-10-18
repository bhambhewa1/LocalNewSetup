// Type Imports
import { UserStatus } from '@/utils/constants'
import type { ThemeColor } from '@core/types'

export type userListingType = {
  _id: string
  firstname: string
  lastname: string
  mobileNo: string
  email?: string
  status: UserStatus
}

export type userDataType = {
  _id?: string
  firstname: string
  lastname: string
  mobileNo: string
  email?: string
  password: string
  role?: string
  status?: UserStatus
  avatar?: string
  avatarColor?: ThemeColor
}
