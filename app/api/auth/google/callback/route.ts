import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, fetchGoogleFitData } from '../route';

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth2 callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/medical?error=google_auth_failed`, request.url)
      );
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        new URL(`/medical?error=no_code`, request.url)
      );
    }

    // Exchange code for access token
    const tokens = await exchangeCodeForToken(code);

    // Fetch initial Google Fit data
    const fitData = await fetchGoogleFitData(tokens.access_token);

    // Store tokens securely (in production, use encrypted database)
    // For now, we'll use cookies with httpOnly flag
    const response = NextResponse.redirect(
      new URL('/medical?success=google_connected', request.url)
    );

    // Set secure cookies (7 days expiry)
    response.cookies.set('google_fit_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    if (tokens.refresh_token) {
      response.cookies.set('google_fit_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        sameSite: 'lax',
      });
    }

    // Store connection status in localStorage (via client-side script)
    response.cookies.set('google_fit_connected', 'true', {
      httpOnly: false, // Accessible to JavaScript
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      new URL(`/medical?error=callback_failed`, request.url)
    );
  }
}
