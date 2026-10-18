// ----------------- Using next-auth ------------------------
// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { authOptions } from '@/libs/auth'

export default async function AuthGuard({ children }: ChildrenType) {
  const session = await getServerSession(authOptions)
  // console.log('helow my session', session)

  return <>{session ? children : <AuthRedirect />}</>
}

// // -------------------- Using redux persist (little bit more secure than cookies) -----------------------------
// 'use client'
// import AuthRedirect from '@/components/AuthRedirect'
// import { useSelector } from 'react-redux'
// import Cookies from 'js-cookie'
// import type { ChildrenType } from '@core/types'
// import type { RootState } from '@/redux-store'

// export default function AuthGuard({ children }: ChildrenType) {
//   const session = useSelector((state: RootState) => state?.loggedUserReducer.role)
//   const token = Cookies.get('userToken')
//   // console.log("session authGuard", session, token)
//   return <>{session && token ? children : <AuthRedirect />}</>
// }

// ------------------- Using server cookies (less secure) ------------------
// // Component Imports
// import AuthRedirect from '@/components/AuthRedirect'
// import { cookies } from 'next/headers'
// // Type Imports
// import type { ChildrenType } from '@core/types'

// export default async function AuthGuard({ children }: ChildrenType) {
//   const cookieStore = await cookies()

//   const session = cookieStore.get('userToken')?.value

//   return <>{session ? children : <AuthRedirect />}</>
// }
