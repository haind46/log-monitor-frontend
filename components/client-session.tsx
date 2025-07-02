'use client'

import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import DefaultLoading from './default-loading'
import { useRouter } from 'next/navigation' 

const ClientSession = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
     router.push('sign-in')
    }
  }, [status])

  if (status === 'loading') return <DefaultLoading />

  return <>{children}</>
}

export default ClientSession
