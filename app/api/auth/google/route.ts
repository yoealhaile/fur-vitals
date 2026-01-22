import { NextRequest, NextResponse } from 'next/server';

// Google OAuth2 Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  : 'http://localhost:3000/api/auth/google/callback';

// Google Fit scopes
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
].join(' ');

/**
 * GET /api/auth/google
 * Initiates Google OAuth2 flow
 */
export async function GET(request: NextRequest) {
  try {
    // Build OAuth2 authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('access_type', 'offline'); // Get refresh token
    authUrl.searchParams.set('prompt', 'consent'); // Force consent screen

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google authentication' },
      { status: 500 }
    );
  }
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string) {
  try {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
}

/**
 * Fetch Google Fit activity data
 */
export async function fetchGoogleFitData(accessToken: string) {
  try {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Fetch activity data (steps, active minutes)
    const dataSourceId = 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments';
    const activityUrl = `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`;

    const requestBody = {
      aggregateBy: [
        {
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        },
        {
          dataTypeName: 'com.google.active_minutes',
          dataSourceId: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes',
        },
      ],
      bucketByTime: { durationMillis: 86400000 }, // 1 day buckets
      startTimeMillis: oneDayAgo,
      endTimeMillis: now,
    };

    const response = await fetch(activityUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google Fit data');
    }

    const data = await response.json();
    
    // Parse and normalize data
    const steps = extractSteps(data);
    const activeMinutes = extractActiveMinutes(data);

    return {
      steps,
      activeMinutes,
      timestamp: new Date().toISOString(),
      source: 'google_fit',
    };
  } catch (error) {
    console.error('Google Fit data fetch error:', error);
    throw error;
  }
}

/**
 * Extract steps from Google Fit response
 */
function extractSteps(data: any): number {
  try {
    const bucket = data.bucket?.[0];
    const stepDataset = bucket?.dataset?.find((ds: any) => 
      ds.dataSourceId?.includes('step_count')
    );
    const stepPoint = stepDataset?.point?.[0];
    return stepPoint?.value?.[0]?.intVal || 0;
  } catch (error) {
    console.error('Error extracting steps:', error);
    return 0;
  }
}

/**
 * Extract active minutes from Google Fit response
 */
function extractActiveMinutes(data: any): number {
  try {
    const bucket = data.bucket?.[0];
    const activeDataset = bucket?.dataset?.find((ds: any) => 
      ds.dataSourceId?.includes('active_minutes')
    );
    const activePoint = activeDataset?.point?.[0];
    return activePoint?.value?.[0]?.intVal || 0;
  } catch (error) {
    console.error('Error extracting active minutes:', error);
    return 0;
  }
}
