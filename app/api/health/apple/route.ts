import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/health/apple
 * Receives Apple Health data from iOS Shortcuts
 * 
 * Expected payload:
 * {
 *   "steps": 8432,
 *   "activeMinutes": 45,
 *   "heartRate": 72,
 *   "sleep": 420,
 *   "date": "2026-01-21",
 *   "deviceId": "unique-device-identifier"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { steps, activeMinutes, date, deviceId } = body;

    if (!steps || !activeMinutes || !date) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['steps', 'activeMinutes', 'date']
        },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof steps !== 'number' || typeof activeMinutes !== 'number') {
      return NextResponse.json(
        { error: 'Invalid data types. Steps and activeMinutes must be numbers' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Normalize data to internal format
    const normalizedData = {
      steps,
      activeMinutes,
      heartRate: body.heartRate || null,
      sleep: body.sleep || null,
      date,
      deviceId: deviceId || 'unknown',
      timestamp: new Date().toISOString(),
      source: 'apple_health',
    };

    // In production, save to database
    // For now, we'll store in a temporary cookie/localStorage via response
    const response = NextResponse.json({
      success: true,
      message: 'Apple Health data received successfully',
      data: normalizedData,
    });

    // Store latest data in cookie for immediate access
    response.cookies.set('apple_health_data', JSON.stringify(normalizedData), {
      httpOnly: false, // Accessible to JavaScript
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('apple_health_connected', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Apple Health endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to process Apple Health data' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/health/apple
 * Returns the latest Apple Health data
 */
export async function GET(request: NextRequest) {
  try {
    const appleHealthData = request.cookies.get('apple_health_data')?.value;

    if (!appleHealthData) {
      return NextResponse.json(
        { error: 'No Apple Health data available' },
        { status: 404 }
      );
    }

    const data = JSON.parse(appleHealthData);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Apple Health data retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Apple Health data' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/health/apple
 * Disconnects Apple Health integration
 */
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // Clear Apple Health cookies
    response.cookies.delete('apple_health_data');
    response.cookies.delete('apple_health_connected');

    return response;
  } catch (error) {
    console.error('Apple Health disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Apple Health' },
      { status: 500 }
    );
  }
}
