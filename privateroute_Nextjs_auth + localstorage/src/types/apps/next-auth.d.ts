// types/next-auth.d.ts  (due to this not error occured in @lib/auth file)
import NextAuth from 'next-auth'
import type { loginusersType } from '../loginUser/loginuserTypes'

declare module 'next-auth' {
  interface User extends loginusersType {}

  interface Session {
    user: User
  }
}
