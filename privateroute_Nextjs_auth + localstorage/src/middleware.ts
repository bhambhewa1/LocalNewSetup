import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { RoleType } from '@/utils/constants'

export const config = {
  matcher: ['/property', '/manage-dealer', '/staff-manager', '/manage-talecaller', '/lead']
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const role = token?.role as RoleType | undefined
  // console.log('my role --------------------', role)

  const pathname = req.nextUrl.pathname

  // If not authenticated or role not found
  if (!token || !role) {
    return NextResponse.next()
  }

  // Route access rules
  const accessMap: Record<string, RoleType[]> = {
    '/property': [RoleType.DEALER, RoleType.TALECALLER, RoleType.MANAGER_STAFF],
    '/manage-dealer': [RoleType.SUPER_ADMIN],
    '/staff-manager': [RoleType.DEALER],
    '/manage-talecaller': [RoleType.DEALER],
    '/lead': [RoleType.MANAGER_STAFF, RoleType.TALECALLER]
  }

  const allowedRoles = accessMap[pathname]

  if (allowedRoles && !allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}
