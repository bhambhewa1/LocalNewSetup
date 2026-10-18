// Type Imports
import type { ThemeColor } from '@core/types'
import type { userDataType } from '../user'

export type leadListingType = {
  _id: string
  firstname: string
  lastname: string
  mobileNo: string
  email?: string
  leadStatus: string
  assignedTo?: userDataType
}

export type leadDataType = {
  _id?: string
  firstname: string
  lastname: string
  mobileNo: string
  email?: string
  address: string
  // country: string
  leadStatus: string
  avatar?: string
  avatarColor?: ThemeColor
}

export type timelineType = {
  _id: string
  leadId: string
  userId: string
  message: string
  createdAt: string
  updatedAt: string
}
