import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const then = requestUrl.searchParams.get('then') ?? '/dashboard'
  const error = requestUrl.searchParams.get('error_description')

  console.log('Auth callback:', { code: !!code, error, then })

  // Redirect to the login page if there is an error
  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session (PKCE)
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Failed to exchange code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        )
      }

      console.log('Auth callback success:', { 
        userId: data.user?.id, 
        email: data.user?.email 
      })

    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(
        new URL(`/login?error=callback_failed`, requestUrl.origin)
      )
    }
  }

  // Revalidate the path in Next.js cache
  revalidatePath('/')

  // Construct the URL to redirect to after the sign in process completes
  const redirectTo = new URL(
    then?.startsWith('/') ? then : '/dashboard',
    requestUrl.origin
  )

  console.log('Auth callback redirecting to:', redirectTo.pathname)

  return NextResponse.redirect(redirectTo)
}
