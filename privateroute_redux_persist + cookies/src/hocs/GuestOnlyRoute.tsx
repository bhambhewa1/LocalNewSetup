// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports
// import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

const GuestOnlyRoute = async ({ children }: ChildrenType) => {
  // const session = await getServerSession()

  // const cookieStore = await cookies()
  // const session = cookieStore.get('userToken')?.value

  // if (session) {
  //   redirect(themeConfig.homePageUrl)
  // }

  return <>{children}</>
}

export default GuestOnlyRoute
