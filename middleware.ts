import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'

export async function middleware(request: NextRequest) {
  // Routes qui nécessitent une authentification
  const protectedRoutes = ['/dashboard', '/orders', '/profile', '/loyalty']
  
  // Routes d'API qui nécessitent une authentification
  const protectedApiRoutes = ['/api/dishes', '/api/orders', '/api/customers', '/api/reviews', '/api/stats']

  const { pathname } = request.nextUrl

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute || isProtectedApiRoute) {
    try {
      const response = NextResponse.next()
      const session = await getIronSession(request, response, {
        password: process.env.SESSION_PASSWORD!,
        cookieName: 'droovo-session',
      })

      // Si pas de session ou pas connecté, rediriger vers login
      if (!session.isLoggedIn) {
        if (isProtectedApiRoute) {
          return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/login', request.url))
      }

      return response
    } catch (error) {
      console.error('Erreur middleware:', error)
      if (isProtectedApiRoute) {
        return NextResponse.json({ message: 'Erreur d\'authentification' }, { status: 500 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/loyalty/:path*',
    '/api/dishes/:path*',
    '/api/orders/:path*',
    '/api/customers/:path*',
    '/api/reviews/:path*',
    '/api/stats/:path*'
  ]
}