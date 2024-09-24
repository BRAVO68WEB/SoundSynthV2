// Clear cookies

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
) {
	cookies().delete('access_token');
    // Redirect to the landing page
    return NextResponse.redirect(new URL('/', request.url));
}