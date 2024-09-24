import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
 
export async function middleware(request: NextRequest) {
    const cookieStore = cookies()
    if (!cookieStore.has('access_token')) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    const access_token = cookieStore.get('access_token')

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${access_token?.value}`,
        },
    }).then((res) => res.json())

    if (res.error) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*',
}