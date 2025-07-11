'use server';
/**
 * @fileOverview Acuity Scheduling API interaction flow.
 *
 * - getAcuityAppointmentTypes - Fetches appointment types from Acuity.
 * - getAcuityAvailableDates - Fetches available dates for one or more appointment types.
 * - getAcuityAvailableTimes - Fetches available times for a primary appointment type on a specific date.
 * - createAcuityAppointment - Creates an appointment in Acuity.
 */

import { z } from 'zod';
import { format } from 'date-fns';

const ACUITY_API_BASE_URL = 'https://acuityscheduling.com/api/v1';
const ACUITY_USER_ID = process.env.ACUITY_USER_ID;
const ACUITY_API_KEY = process.env.ACUITY_API_KEY;

async function fetchAcuityAPI(endpoint: string, options: RequestInit = {}) {
  if (!ACUITY_USER_ID || !ACUITY_API_KEY) {
    throw new Error('Acuity API credentials are not configured.');
  }

  const headers = new Headers(options.headers || {});
  const encodedCredentials = Buffer.from(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`).toString('base64');
  headers.set('Authorization', 'Basic ' + encodedCredentials);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${ACUITY_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Acuity API Error (${response.status}) on ${endpoint}: ${errorBody}`);
    throw new Error(`Acuity API request failed: ${response.statusText} - ${errorBody}`);
  }
  return response.json();
}

const AcuityAppointmentTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().default(""),
  price: z.string(),
  duration: z.number(),
  category: z.string().optional().default(""),
  color: z.string().optional(),
  private: z.boolean().optional(),
  image: z.string().nullable().optional(), // Añadido campo para la URL de la imagen
});
export type AcuityAppointmentType = z.infer<typeof AcuityAppointmentTypeSchema>;

const AcuityAvailableTimeSchema = z.object({
  time: z.string(),
  slotsAvailable: z.number(),
  calendarID: z.number().optional(),
});
export type AcuityAvailableTime = z.infer<typeof AcuityAvailableTimeSchema>;

const CreateAcuityAppointmentInputSchema = z.object({
  appointmentTypeID: z.number(),
  datetime: z.string().describe("Appointment date and time in ISO 8601 format, e.g., '2024-07-26T09:00:00-0500'"),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  addonIDs: z.array(z.number()).optional(),
  calendarID: z.number().optional(),
});
export type CreateAcuityAppointmentInput = z.infer<typeof CreateAcuityAppointmentInputSchema>;

const AcuityAppointmentSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  email: z.string(),
  date: z.string(),
  time: z.string(),
  endTime: z.string(),
  dateCreated: z.string(),
  datetime: z.string(),
  price: z.string(),
  paid: z.string(),
  amountPaid: z.string(),
  type: z.string(),
  appointmentTypeID: z.number(),
  classID: z.number().nullable(),
  addonIDs: z.array(z.number()),
  category: z.string(),
  duration: z.string(),
  calendar: z.string(),
  calendarID: z.number(),
  canClientCancel: z.boolean(),
  canClientReschedule: z.boolean(),
  location: z.string(),
  notes: z.string().nullable(),
  timezone: z.string(),
  calendarTimezone: z.string(),
  confirmationPage: z.string().url(),
  formsText: z.string().optional(),
});
export type AcuityAppointment = z.infer<typeof AcuityAppointmentSchema>;


export async function getAcuityAppointmentTypes(): Promise<AcuityAppointmentType[]> {
  console.log('ENTERING getAcuityAppointmentTypes function NOW...'); // Log de prueba simple
  const data = await fetchAcuityAPI('/appointment-types');
  console.log('Acuity Appointment Types RAW DATA:', JSON.stringify(data, null, 2)); // Log para inspeccionar la estructura completa
  return z.array(AcuityAppointmentTypeSchema).parse(data);
}

const GetAcuityAvailableDatesInputSchema = z.object({
  appointmentTypeIDs: z.array(z.number()).min(1, "At least one appointment type ID is required"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
});
export type GetAcuityAvailableDatesInput = z.infer<typeof GetAcuityAvailableDatesInputSchema>;

export async function getAcuityAvailableDates(input: GetAcuityAvailableDatesInput): Promise<string[]> {
  const { appointmentTypeIDs, month } = GetAcuityAvailableDatesInputSchema.parse(input);
  
  if (appointmentTypeIDs.length === 0) {
    return [];
  }
  
  // Correctly format for multiple appointmentTypeIDs
  // Acuity API documentation for /availability/dates suggests using appointmentTypeIDs[] for multiple values.
  // However, error "The parameter \"appointmentTypeID\" is required" occurs when sending only one ID via appointmentTypeIDs[].
  // Acuity /availability/dates endpoint always expects a single, primary appointmentTypeID.
  // The frontend (AcuityScheduler.tsx) now sends only the primaryService.id in the appointmentTypeIDs array.
  if (appointmentTypeIDs.length !== 1) {
    console.error("getAcuityAvailableDates expects exactly one appointmentTypeID (primary service ID). Received:", appointmentTypeIDs);
    throw new Error("Invalid input: getAcuityAvailableDates expects a single primary appointmentTypeID.");
  }
  
  const primaryAppointmentTypeID = appointmentTypeIDs[0];
  const endpoint = `/availability/dates?month=${month}&appointmentTypeID=${primaryAppointmentTypeID}`;
  
  console.log(`Requesting Acuity endpoint: ${endpoint}`);
  const data = await fetchAcuityAPI(endpoint);
  console.log('Data received from Acuity (raw):', JSON.stringify(data, null, 2));

  let datesToParse: string[] = [];

  // Expect data to be an array of objects with a 'date' property, as Acuity returns this for single appointmentTypeID.
  if (Array.isArray(data)) {
    if (data.length === 0) {
      // Empty array is a valid response (no dates available)
      datesToParse = [];
    } else if (typeof data[0] === 'object' && data[0] !== null && 'date' in data[0]) {
      // Transform data to an array of date strings
      try {
        datesToParse = data.map(item => {
          if (typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
            return item.date;
          }
          // If item.date is not a valid date string, this item will be problematic.
          // Consider filtering it out or throwing a more specific error if strictness is required.
          // For now, let Zod catch it later if it's not a string, or the regex for format.
          // However, the map might produce undefined/null if item.date is not as expected.
          // Adding explicit error for unexpected structure within the map.
          throw new Error(`Invalid date object in Acuity response: ${JSON.stringify(item)}`);
        });
      } catch (e) {
        console.error("Error transforming Acuity data:", e);
        throw new Error(`Failed to transform Acuity date data: ${e instanceof Error ? e.message : String(e)}`);
      }
    } else {
      // If it's an array but not of expected objects (e.g., array of strings, which we don't expect here anymore)
      console.error('Unexpected array item structure from Acuity:', JSON.stringify(data[0], null, 2));
      throw new Error('Unexpected array item structure received from Acuity for dates.');
    }
    console.log('Transformed data for Zod parsing:', JSON.stringify(datesToParse, null, 2));
  } else {
    // If data is not an array at all
    console.error('Unexpected data structure (not an array) from Acuity:', JSON.stringify(data, null, 2));
    throw new Error('Unexpected data structure (not an array) received from Acuity for dates.');
  }
  
  return z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).parse(datesToParse);
}


const GetAcuityAvailableTimesInputSchema = z.object({
  appointmentTypeID: z.number().describe("The primary appointment type ID to check availability for."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});
export type GetAcuityAvailableTimesInput = z.infer<typeof GetAcuityAvailableTimesInputSchema>;

export async function getAcuityAvailableTimes(input: GetAcuityAvailableTimesInput): Promise<AcuityAvailableTime[]> {
  const { appointmentTypeID, date } = GetAcuityAvailableTimesInputSchema.parse(input);

  const endpoint = `/availability/times?date=${date}&appointmentTypeID=${appointmentTypeID}`;
  
  const data = await fetchAcuityAPI(endpoint);
  return z.array(AcuityAvailableTimeSchema).parse(data);
}

export async function createAcuityAppointment(input: CreateAcuityAppointmentInput): Promise<AcuityAppointment> {
  const payload: any = {
    appointmentTypeID: input.appointmentTypeID,
    datetime: input.datetime,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
  };

  if (input.phone) {
    payload.phone = input.phone;
  }
  if (input.notes) {
    payload.fields = [{ id: 1, value: input.notes }];
  }
  if (input.addonIDs && input.addonIDs.length > 0) {
    payload.addonIDs = input.addonIDs;
  }
  if (input.calendarID) {
    payload.calendarID = input.calendarID;
  }

  const data = await fetchAcuityAPI('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return AcuityAppointmentSchema.parse(data);
}
