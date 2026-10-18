// Login router replace only client side routes (not invoke the server component, so server cookies not update,
// so AuthGuard need to client component for redux-persist)

// -------------------- Using redux persist (little bit more secure than cookies) -----------------------------
'use client'
import AuthRedirect from '@/components/AuthRedirect'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import type { ChildrenType } from '@core/types'
import type { RootState } from '@/redux-store'

export default function AuthGuard({ children }: ChildrenType) {
  const session = useSelector((state: RootState) => state?.loggedUserReducer.role)
  const token = Cookies.get('userToken')
  // console.log("session authGuard", session, token)
  return <>{session && token ? children : <AuthRedirect />}</>
}

// // ------------------- Using cookies (not server component, less secure) ------------------
// 'use client'
// import AuthRedirect from '@/components/AuthRedirect'
// import Cookies from 'js-cookie'
// import type { ChildrenType } from '@core/types'

// export default function AuthGuard({ children }: ChildrenType) {
//   const session = Cookies.get('userToken')
//   // console.log("cookies authGuard", session)
//   return <>{session ? children : <AuthRedirect />}</>
// }

// // ---------------- Using server cookies (work only in dev mode) ---------------------
// import AuthRedirect from '@/components/AuthRedirect'
// import { cookies } from 'next/headers'
// import type { ChildrenType } from '@core/types'

// export default async function AuthGuard({ children }: ChildrenType) {
//   const cookieStore = await cookies()
//   const session = cookieStore.get('userToken')?.value
//   // console.log('cookies authGuard', session)
//   return <>{session ? children : <AuthRedirect />}</>
// }

// // ---------------------- Using next-auth -----------------------------------
// import AuthRedirect from '@/components/AuthRedirect'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/libs/auth'
// import type { ChildrenType } from '@core/types'

// export default async function AuthGuard({ children }: ChildrenType) {
//   const session = await getServerSession(authOptions)
//   // console.log('helow my session', session)
//   return <>{session ? children : <AuthRedirect />}</>
// }

