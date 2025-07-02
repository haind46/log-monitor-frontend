import axios from 'axios'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';

// Extend Session type to include access_token
declare module 'next-auth' {
  interface Session {
    access_token?: string;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

axiosInstance.interceptors.request.use(
  async function (config) {
    const session = await getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  
  function (response) {
    return response
  },
  async function (error) {
    console.log('error.response.status='+error.response.status)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      signOut({ redirect: false })
      .then(() => {
        useRouter().push("/sign-in");
      })
      .catch(console.log);
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
