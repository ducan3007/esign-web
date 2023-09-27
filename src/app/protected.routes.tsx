import { actions, selectors } from '@esign-web/redux/auth'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useSearchParams } from 'react-router-dom'
import { FallbackLoading } from './components/Loading'
import { baseApi } from '@esign-web/libs/utils'

const PATH_OUT_OF_AUTH_SCOPE = ['/document/sign', '/document/preview', '/document/preview/']

export const ProtectedRoute = (props: any) => {
  const authState = useSelector(selectors.getAuthState)
  const dispatch = useDispatch()
  const tokenFromUrl = new URLSearchParams(window.location.search).get('token')
  const path = window.location.pathname

  useEffect(() => {
    if (authState.isAuthorized) {
      return
    }
    if (!PATH_OUT_OF_AUTH_SCOPE.includes(path)) {
      dispatch(actions.authorize())
    }
  }, [authState.isAuthorized, dispatch])

  useEffect(() => {
    if (PATH_OUT_OF_AUTH_SCOPE.includes(path)) {
      dispatch(actions.authorize())
    }
  }, [tokenFromUrl])

  // if (authState.isAuthorized && authState.data?.is_registerd === false) {
  //   window.location.replace('/register')
  //   return <FallbackLoading />
  // }

  // Unauthenticated
  if (!authState.isAuthorized) {
    return <FallbackLoading />
  }

  return <>{props.children}</>
}

export const AuthenticationTokenHOC = (Component: any) => {
  const token = localStorage.getItem('token')

  console.log('token', token)

  return (props: any) => {
    if (!token) {
      return <Component {...props} />
    }
    return window.location.replace('/')
  }
}
