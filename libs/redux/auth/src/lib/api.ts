import { baseApi } from '@esign-web/libs/utils'

export const loginApi = (payload: { email: string; password: string }) => {
  console.log('loginApi', payload)
  return baseApi.post('/auth/login', payload)
}

export const registerApi = (payload: { email: string; password: string; name: string; confirmPassword: string }) => {
  return baseApi.post('/auth/signup', payload)
}

export const authorizeUserByToken = (payload: { token: string }) => {
  baseApi.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
  const url = `/auth/permission?cb=${new Date().getTime()}`
  return baseApi.get(url)
}
