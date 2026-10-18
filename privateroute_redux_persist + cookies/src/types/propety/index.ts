export type propertyShowListingType = {
  _id: string
  name: string
  owner: string
  propertyType: string
  listingType: string
  status: string
}

export type propertyListType = {
  _id?: string
  name: string
  owner: string
  propertyType: string
  furnishedStatus?: string
  listingType: string
  price: number | string
  address: string
  dimension: dimensionType
  description: string
  status: string
  media: string[]
  dealers?: string[]
}

export type mediaObject = {
  name: string
  type: string
  url: string
}

export type dimensionType = {
  length: number | string
  width: number | string
  area: number | string
  // front: number | string
  facing: string
}
