import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleFitData } from '../../auth/google/route';

/**
 * GET /api/health/google
 * Fetches latest Google Fit data for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('google_fit_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Google Fit' },
        { status: 401 }
      );
    }

    // Fetch latest data
    const fitData = await fetchGoogleFitData(accessToken);

    return NextResponse.json({
      success: true,
      data: fitData,
    });
  } catch (error) {
    console.error('Google Fit data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Fit data' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/health/google
 * Disconnects Google Fit integration
 */
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // Clear all Google Fit cookies
    response.cookies.delete('google_fit_access_token');
    response.cookies.delete('google_fit_refresh_token');
    response.cookies.delete('google_fit_connected');

    return response;
  } catch (error) {
    console.error('Google Fit disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Google Fit' },
      { status: 500 }
    );
  }
}
