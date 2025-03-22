import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/lib/useAuth'

export default function AuthRoutesLayout() {
  const { isAuthenticated, loading } = useAuth()

  // If still loading auth state, show nothing yet
  if (loading) {
    return null
  }

  // If user is already signed in, redirect to home
  if (isAuthenticated) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}
