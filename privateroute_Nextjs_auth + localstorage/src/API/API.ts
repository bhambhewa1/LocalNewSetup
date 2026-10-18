export const Auth = {
  Login: `/api/auth/login`,
  ForgotPassword: `/auth/forgot-password`,
  ResetPassword: `/auth/reset-password`,
  ChangePassword: `/auth/change-password`
}

export const countryAPI = {
  get_all_countries: `/api/country/all-list`
}

export const dashboardAPI = {
  getDashboard: `/api/users/dashboard`
}

export const propertyAPI = {
  getPropertyListing: `/api/property`,
  createProperty: `/api/property`,
  // getProperty: `/api/property`, //by id     (Not in use)
  updateProperty: `/api/property`, //by id
  deleteProperty: `/api/property`, //by id
  deletePropertyMedia: `/api/property/media`, //by {property_id}
  assignDealerToProperty: `/api/property` //by {/id/assign-dealers}
}

export const userAPI = {
  getUserListing: `/api/users`,
  createUser: `/api/users`,
  // getUser: `/api/users`, //by id      (Not in use)
  updateUser: `/api/users`, //by id
  deleteUser: `/api/users` //by id
}

export const leadAPI = {
  getLeadListing: `/api/leads`,
  createLead: `/api/leads`,
  getLead: `/api/leads`, //by id
  updateLead: `/api/leads`, //by id
  // deleteLead: `/api/leads`, //by id   (Not created this)
  assign_talecaller: `/api/leads/assign` //by id
}

export const leadTimeline = {
  create: `/api/message`, // leadId & consultantId but these go inside a query ( params: {})
  get: `/api/message` // leadId but this go as param (url+id appended)
}
