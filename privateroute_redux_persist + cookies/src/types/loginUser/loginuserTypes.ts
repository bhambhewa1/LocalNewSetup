// Type Imports
import type { ThemeColor } from '@core/types'

export type organizationType = {
  _id: string
  name: string
  status: string
}

export type loginusersType = {
  _id: string
  firstname: string
  lastname: string
  mobile: string
  email?: string
  role: string
  organization?: organizationType
  avatar?: string
  avatarColor?: ThemeColor
  password?: string
}
