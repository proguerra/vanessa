import { getAcuityAppointmentTypes } from '@/ai/flows/acuity-booking-flow';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const services = await getAcuityAppointmentTypes();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services in API route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
