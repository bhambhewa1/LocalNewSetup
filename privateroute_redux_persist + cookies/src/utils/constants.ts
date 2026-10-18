//  -------------------------------------- ENUM HERE  ----------------------------

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DEALER = 'DEALER',
  TALECALLER = 'TALECALLER',
  MANAGER_STAFF = 'MANAGER_STAFF'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  TEMP_INACTIVE = 'TEMP_INACTIVE',
  INACTIVE = 'INACTIVE'
}

// -----------------------------------------------------------------------------------

export const showUserStatus = {
  [UserStatus.ACTIVE]: 'ACTIVE',
  [UserStatus.TEMP_INACTIVE]: 'INACTIVE',
  [UserStatus.INACTIVE]: 'DELETED'
}

export const documentTypes = {
  'application/pdf': 'PDF Document',
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'video/mp4': 'Video',
  'application/msword': 'Microsoft Word Document (.doc)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word Document (.docx)',
  'application/vnd.ms-excel': 'Microsoft Excel Document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel Document (.xlsx)',
  'application/vnd.ms-powerpoint': 'Microsoft PowerPoint Document (.ppt)',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint Document (.pptx)',
  'text/plain': 'Text Document',
  'application/zip': 'ZIP Archive',
  'application/x-rar-compressed': 'RAR Archive'
}

export const propertyType = [
  { key: 'APARTMENT', label: 'Apartment' },
  { key: 'HOUSE', label: 'House' },
  { key: 'PLOT', label: 'Plot' },
  { key: 'COMMERCIAL', label: 'Commercial' },
  { key: 'LAND', label: 'Land' },
  { key: 'VILLA', label: 'Villa' }
]

export const furnishedStatus = [
  { key: 'FURNISHED', label: 'Furnished' },
  { key: 'UNFURNISHED', label: 'Un-Furnished' },
  { key: 'SEMIFURNISHED', label: 'Semi-Furnished' }
]

export const listingType = [
  { key: 'RENT', label: 'Rent' },
  { key: 'SALE', label: 'Sale' },
  { key: 'LEASE', label: 'Lease' }
]

export const directions = [
  { key: 'EAST', label: 'East' },
  { key: 'WEST', label: 'West' },
  { key: 'NORTH', label: 'North' },
  { key: 'SOUTH', label: 'South' }
]

export const propertyStatus = [
  { key: 'AVAILABLE', label: 'Available' },
  { key: 'SOLD', label: 'Sold' },
  { key: 'PENDING', label: 'Pending' }
]

export const leadStatus = [
  { key: 'NEW', color: 'error', label: 'New lead' },
  { key: 'FOLLOWUP', color: 'success', label: 'Followup' },
  { key: 'CLOSED', color: 'warning', label: 'Closed' },
  { key: 'DEAD', color: 'secondary', label: 'Dead lead' }
]

export const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
export const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv']
