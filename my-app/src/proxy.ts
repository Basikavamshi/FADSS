import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const token = req.cookies.get('auth')?.value
  const path = req.nextUrl.pathname

  const isDashboard = path.startsWith('/DashBoard')
  const isHome = path === '/'
  const islogin =path==='/login'
  const issingup=path==='/signup'

  // 🔒 If trying to access dashboard but no token → redirect to home
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ✅ If on home and token exists → redirect to dashboard
  if (isHome && token) {
    return NextResponse.redirect(new URL('/DashBoard', req.url))
  }
  if(islogin && token){
     return NextResponse.redirect(new URL('/DashBoard', req.url))
  }
  if(issingup && token){
     return NextResponse.redirect(new URL('/DashBoard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/','/login','/signup','/DashBoard/:path*'],
}
