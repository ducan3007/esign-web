import { actions, selectors } from '@esign-web/redux/auth'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redirect } from 'react-router-dom'
import { FallbackLoading } from './components/Loading'

export const ProtectedRoute = (props: any) => {
  const authState = useSelector(selectors.getAuthState)
  const dispatch = useDispatch()

  useEffect(() => {
    // console.log('protected effect', authState.isAuthorized)
    // if (!authState.isAuthorized) {
    if (authState.isAuthorized) {
      return
    }
    dispatch(actions.authorize())
    // }
  }, [authState.isAuthorized, dispatch])

  console.log('protected', authState.isAuthorized)

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
