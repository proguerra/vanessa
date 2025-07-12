

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse, addMonths, startOfMonth, isValid,parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, ShoppingBag, CalendarDays, Clock, User } from 'lucide-react';

import {
  getAcuityAppointmentTypes,
  getAcuityAvailableDates,
  getAcuityAvailableTimes,
  createAcuityAppointment,
  type AcuityAppointmentType,
  type AcuityAvailableTime,
  type CreateAcuityAppointmentInput,
  type AcuityAppointment
} from '@/ai/flows/acuity-booking-flow';

const clientDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  notes: z.string().optional(),
});
type ClientDetailsFormData = z.infer<typeof clientDetailsSchema>;

type BookingStep = 'selectService' | 'selectDateTime' | 'enterDetails' | 'confirmation';

export default function AcuityScheduler() {
  const { toast } = useToast();
  const [bookingStep, setBookingStep] = useState<BookingStep>('selectService');

  const [appointmentTypes, setAppointmentTypes] = useState<AcuityAppointmentType[]>([]);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<AcuityAppointmentType | null>(null);

  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(startOfMonth(new Date()));
  const [availableDates, setAvailableDates] = useState<string[]>([]); // "YYYY-MM-DD"
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [availableTimes, setAvailableTimes] = useState<AcuityAvailableTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // "9:00am"

  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [bookingConfirmation, setBookingConfirmation] = useState<AcuityAppointment | null>(null);

  const form = useForm<ClientDetailsFormData>({
    resolver: zodResolver(clientDetailsSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
  });

  useEffect(() => {
    async function fetchAppointmentTypes() {
      setIsLoadingServices(true);
      try {
        const types = await getAcuityAppointmentTypes();
        setAppointmentTypes(types.filter(type => !type.private)); // Filter out private types
      } catch (error) {
        toast({ title: "Error", description: "Could not load services. Please try again later.", variant: "destructive" });
        console.error("Failed to fetch appointment types:", error);
      } finally {
        setIsLoadingServices(false);
      }
    }
    fetchAppointmentTypes();
  }, [toast]);

  useEffect(() => {
    if (selectedAppointmentType) {
      async function fetchDates() {
        setIsLoadingDates(true);
        setAvailableDates([]);
        setSelectedDate(undefined); // Reset date when service changes
        setAvailableTimes([]); // Reset times
        setSelectedTime(null); // Reset time
        try {
          const monthStr = format(currentCalendarMonth, 'yyyy-MM');
          const dates = await getAcuityAvailableDates({
            appointmentTypeIDs: [selectedAppointmentType.id], // Corregido: usar appointmentTypeIDs (plural) y enviar como array
            month: monthStr,
          });
          setAvailableDates(dates);
        } catch (error) {
          toast({ title: "Error", description: "Could not load available dates for this service.", variant: "destructive" });
          console.error("Failed to fetch available dates:", error);
        } finally {
          setIsLoadingDates(false);
        }
      }
      fetchDates();
    }
  }, [selectedAppointmentType, currentCalendarMonth, toast]);

  useEffect(() => {
    if (selectedAppointmentType && selectedDate) {
      async function fetchTimes() {
        setIsLoadingTimes(true);
        setAvailableTimes([]);
        setSelectedTime(null);
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const times = await getAcuityAvailableTimes({
            appointmentTypeID: selectedAppointmentType.id,
            date: dateStr,
          });
          setAvailableTimes(times);
        } catch (error) {
          toast({ title: "Error", description: "Could not load available times for this date.", variant: "destructive" });
          console.error("Failed to fetch available times:", error);
        } finally {
          setIsLoadingTimes(false);
        }
      }
      fetchTimes();
    }
  }, [selectedAppointmentType, selectedDate, toast]);

  const handleServiceSelect = (serviceId: string) => {
    const service = appointmentTypes.find(s => s.id === parseInt(serviceId));
    if (service) {
      setSelectedAppointmentType(service);
      setBookingStep('selectDateTime');
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Reset time selection when a new date is picked
      setSelectedTime(null);
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const onSubmitClientDetails: SubmitHandler<ClientDetailsFormData> = async (data) => {
    if (!selectedAppointmentType || !selectedDate || !selectedTime) {
      toast({ title: "Error", description: "Please complete all selections.", variant: "destructive" });
      return;
    }
    setIsBooking(true);
    setBookingConfirmation(null);

    // Format datetime for Acuity: "YYYY-MM-DD h:mm am/pm" or "YYYY-MM-DD HH:MM:SS"
    // The time from Acuity is like "9:00am". Date is a Date object.
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const datetimeStr = `${dateStr} ${selectedTime}`; // Example: "2024-07-26 9:00am"

    const bookingInput: CreateAcuityAppointmentInput = {
      appointmentTypeID: selectedAppointmentType.id,
      datetime: datetimeStr,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
    };

    try {
      const confirmation = await createAcuityAppointment(bookingInput);
      setBookingConfirmation(confirmation);
      setBookingStep('confirmation');
      toast({ title: "Success!", description: "Your appointment has been booked.", variant: "default" });
    } catch (error) {
      console.error("Booking failed:", error);
      toast({ title: "Booking Failed", description: (error as Error).message || "Could not book appointment. Please try again.", variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };
  
  const availableDatesForPicker = useMemo(() => {
    return availableDates.map(dateStr => parseISO(dateStr));
  }, [availableDates]);

  const disabledDateMatcher = (date: Date) => {
    if (isLoadingDates) return true; // Disable all while loading
    // Disable past dates
    const today = startOfMonth(new Date()); // Compare with start of today to allow selection of today
    if (date < today && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')) {
        // If current month is same as today's month, disable past days
        if (format(date, 'yyyy-MM') === format(new Date(), 'yyyy-MM') && date < new Date() && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')) {
             return true;
        }
        // If it's a past month entirely, it's already handled by onMonthChange or default view.
        // This primarily ensures days in the *current* month that are in the past are disabled.
    }
    const dateStr = format(date, 'yyyy-MM-dd');
    return !availableDates.includes(dateStr);
  };


  const resetBooking = () => {
    setBookingStep('selectService');
    setSelectedAppointmentType(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setAvailableDates([]);
    setAvailableTimes([]);
    setCurrentCalendarMonth(startOfMonth(new Date()));
    form.reset();
    setBookingConfirmation(null);
  };

  if (isLoadingServices) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Loading Services...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (appointmentTypes.length === 0 && !isLoadingServices) {
     return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <AlertCircle className="mr-2 h-8 w-8 text-destructive" /> No Services Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-lg">We couldn't find any services to book at the moment. Please check back later or contact us directly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl">
      {bookingStep === 'selectService' && (
        <>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary flex items-center">
              <ShoppingBag className="mr-3 h-8 w-8 text-accent" />
              1. Select a Service
            </CardTitle>
            <CardDescription className="font-body">Choose from our range of beauty and waxing services.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleServiceSelect}>
              <SelectTrigger className="w-full text-lg py-6 font-body">
                <SelectValue placeholder="Click to choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map(type => (
                  <SelectItem key={type.id} value={type.id.toString()} className="text-md py-2 font-body">
                    {type.name} - ${type.price} ({type.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </>
      )}

      {bookingStep === 'selectDateTime' && selectedAppointmentType && (
        <>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary flex items-center">
               <CalendarDays className="mr-3 h-8 w-8 text-accent" />
              2. Select Date & Time
            </CardTitle>
            <CardDescription className="font-body">
              For: <strong>{selectedAppointmentType.name}</strong> (${selectedAppointmentType.price}, {selectedAppointmentType.duration} min)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-lg font-semibold font-headline mb-2 block">Available Dates</Label>
              {isLoadingDates && <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
              {!isLoadingDates && 
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentCalendarMonth}
                  onMonthChange={setCurrentCalendarMonth}
                  disabled={disabledDateMatcher}
                  className="rounded-md border p-0"
                  fromDate={new Date()} // Disable past months/years navigation
                />
              }
               {!isLoadingDates && availableDates.length === 0 && <p className="text-muted-foreground font-body mt-2">No dates available for this service in the selected month. Try a different month or service.</p>}
            </div>

            {selectedDate && (
              <div>
                <Label className="text-lg font-semibold font-headline mb-2 block">
                  Available Times for {format(selectedDate, "PPP")}
                </Label>
                {isLoadingTimes && <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {!isLoadingTimes && availableTimes.length === 0 && <p className="text-muted-foreground font-body">No times available for this date. Please select another date.</p>}
                {!isLoadingTimes && availableTimes.length > 0 && (
                  <RadioGroup
                    value={selectedTime || ""}
                    onValueChange={handleTimeSelect}
                    className="grid grid-cols-3 gap-2 md:grid-cols-4"
                  >
                    {availableTimes.map(timeSlot => (
                      <Label
                        key={timeSlot.time}
                        htmlFor={`time-${timeSlot.time}`}
                        className={`font-body flex items-center justify-center rounded-md border p-3 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors
                          ${selectedTime === timeSlot.time ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'bg-background'}`}
                      >
                        <RadioGroupItem value={timeSlot.time} id={`time-${timeSlot.time}`} className="sr-only" />
                        <Clock className="mr-2 h-4 w-4" /> {timeSlot.time}
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setBookingStep('selectService')} className="font-body">Back to Services</Button>
            <Button onClick={() => setBookingStep('enterDetails')} disabled={!selectedTime || !selectedDate || !selectedAppointmentType} className="font-body">
              Next: Your Details
            </Button>
          </CardFooter>
        </>
      )}

      {bookingStep === 'enterDetails' && selectedAppointmentType && selectedDate && selectedTime && (
         <>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary flex items-center">
              <User className="mr-3 h-8 w-8 text-accent" />
              3. Your Details
            </CardTitle>
            <CardDescription className="font-body">
              Booking: <strong>{selectedAppointmentType.name}</strong> on <strong>{format(selectedDate, "PPP")}</strong> at <strong>{selectedTime}</strong>.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitClientDetails)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline">First Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Jane" className="font-body" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline">Last Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Doe" className="font-body" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Email</FormLabel>
                    <FormControl><Input type="email" {...field} placeholder="jane.doe@example.com" className="font-body" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Phone (Optional)</FormLabel>
                    <FormControl><Input type="tel" {...field} placeholder="555-123-4567" className="font-body" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Notes (Optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="Any special requests?" className="font-body" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setBookingStep('selectDateTime')} className="font-body" type="button">Back to Date/Time</Button>
                <Button type="submit" disabled={isBooking} className="font-body">
                  {isBooking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </>
      )}
      
      {bookingStep === 'confirmation' && bookingConfirmation && (
        <>
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-headline text-primary">Appointment Confirmed!</CardTitle>
            <CardDescription className="font-body text-lg">
              Thank you, {bookingConfirmation.firstName}! Your appointment for <strong>{bookingConfirmation.type}</strong> is booked.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-body text-center">
            <p><strong>Date:</strong> {bookingConfirmation.date}</p>
            <p><strong>Time:</strong> {bookingConfirmation.time} ({bookingConfirmation.timezone})</p>
            <p><strong>Email:</strong> {bookingConfirmation.email}</p>
            {bookingConfirmation.phone && <p><strong>Phone:</strong> {bookingConfirmation.phone}</p>}
            <p className="text-sm text-muted-foreground pt-2">A confirmation email has been sent to you. You can manage your appointment via the link in your email or at: <a href={bookingConfirmation.confirmationPage} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-accent">{bookingConfirmation.confirmationPage}</a></p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={resetBooking} className="font-body">Book Another Appointment</Button>
          </CardFooter>
        </>
      )}

    </Card>
  );
}

// Ensure the original filename is noted if this component was renamed.
// This component was originally AcuityBooking.tsx
