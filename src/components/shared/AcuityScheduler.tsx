"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO, startOfMonth } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, CalendarDays, Clock, User, ArrowRight, ShoppingCart, Trash2, CreditCard, Sparkles } from 'lucide-react';
import { getAcuityAppointmentTypes, getAcuityAvailableDates, getAcuityAvailableTimes, createAcuityAppointment } from '@/ai/flows/acuity-booking-flow';
import type { AcuityAppointmentType, AcuityAvailableTime, CreateAcuityAppointmentInput, AcuityAppointment } from '@/ai/flows/acuity-booking-flow';
import { categorizeServicesForArea } from '@/lib/acuity-helpers';

// const ServiceSelectionModal = ({ services, onAdd, onClose, categoryTitle }: { services: AcuityAppointmentType[], onAdd: (service: AcuityAppointmentType) => void, onClose: () => void, categoryTitle: string }) => (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
//         <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
//             <CardHeader>
//                 <CardTitle>{categoryTitle}</CardTitle>
//                 <CardDescription>Click a service to add it to your appointment.</CardDescription>
//             </CardHeader>
//             <CardContent className="max-h-[60vh] overflow-y-auto">
//                 {services.length > 0 ? (
//                     <ul className="space-y-2">
//                         {services.map(service => (
//                             <li key={service.id} onClick={() => onAdd(service)} className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center transition-colors">
//                                 <div>
//                                     <h4 className="font-semibold">{service.name}</h4>
//                                     {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
//                                 </div>
//                                 <div className="text-right flex-shrink-0 ml-4">
//                                     <p className="font-bold text-primary">${service.price}</p>
//                                     <p className="text-sm text-muted-foreground">{service.duration} min</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-muted-foreground text-center py-8">No services found for this body part. Please select another area.</p>
//                 )}
//             </CardContent>
//             <CardFooter>
//                  <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
//             </CardFooter>
//         </Card>
//     </div>
// );

const clientDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "A valid phone number is required"),
  notes: z.string().optional(),
});
type ClientDetailsFormData = z.infer<typeof clientDetailsSchema>;

type BookingStep = 'selectGender' | 'selectService' | 'selectDateTime' | 'enterDetails' | 'payment' | 'confirmation';

const ServiceArea = ({ position, label, onClick }: { position: string, label: string, onClick: () => void }) => (
    <div
        onClick={onClick}
        // Eliminado backdrop-blur-sm y cualquier bg-* para transparencia total. El hover ahora solo agranda.
        className={`absolute ${position} w-24 h-24 rounded-full cursor-pointer flex items-center justify-center text-center p-2 transition-all duration-300 transform hover:scale-110 shadow-md`} 
    >
        {/* Aumentar el text-shadow para mejor contraste sobre imagen de fondo */}
        <span className="font-semibold text-xs leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">{label}</span>
    </div>
);


export default function AcuityScheduler() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const serviceIdsParam = searchParams.get('serviceIds');

  const [allAppointmentTypes, setAllAppointmentTypes] = useState<AcuityAppointmentType[]>([]);
  // const [filteredServices, setFilteredServices] = useState<AcuityAppointmentType[]>([]); // Reemplazado por servicesForSelectedArea
  const [cart, setCart] = useState<AcuityAppointmentType[]>([]);
  
  const [bookingStep, setBookingStep] = useState<BookingStep>('selectGender');
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | null>(null);
  const [servicesForSelectedArea, setServicesForSelectedArea] = useState<AcuityAppointmentType[]>([]);
  const [selectedAreaTitle, setSelectedAreaTitle] = useState<string>('');

  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(startOfMonth(new Date()));
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<AcuityAvailableTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // ISO time string

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<AcuityAppointment | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ClientDetailsFormData>({
    resolver: zodResolver(clientDetailsSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
  });
  
  const primaryService = useMemo(() => {
    if (cart.length === 0) return null;
    return [...cart].sort((a, b) => b.duration - a.duration)[0];
  }, [cart]);

  useEffect(() => {
    if (apiError) {
      toast({
        title: "Error",
        description: apiError,
        variant: "destructive",
      });
      setApiError(null);
    }
  }, [apiError, toast]);

  useEffect(() => {
    async function fetchAndSetup() {
      setIsLoading(true);
      try {
        const types = (await getAcuityAppointmentTypes()).filter(type => !type.private);
        setAllAppointmentTypes(types);

        if (serviceIdsParam) {
            const ids = serviceIdsParam.split(',').map(id => parseInt(id, 10));
            const servicesFromParams = types.filter(s => ids.includes(s.id));
            if (servicesFromParams.length > 0) {
                setCart(servicesFromParams);
                setBookingStep('selectDateTime');
            } else {
                 setApiError("The selected service couldn't be found. Please choose another.");
                 setBookingStep('selectGender');
            }
        } else {
            setBookingStep('selectGender');
        }
      } catch (error) {
        setApiError("Could not load services. Please try again later.");
        setBookingStep('selectGender');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAndSetup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceIdsParam]);

  // Refuerzo de cartIdsForEffect para asegurar que siempre sea un string JSON de un array.
  const cartIdsArray = useMemo(() => {
    if (!cart) return []; // Manejar si cart es undefined/null inicialmente (aunque useState([]) lo previene)
    return cart.map(s => s.id).sort();
  }, [cart]);
  const cartIdsForEffect = useMemo(() => JSON.stringify(cartIdsArray), [cartIdsArray]);

  // useEffect para depurar primaryService, se ejecutará cada vez que primaryService cambie.
  useEffect(() => {
    if (typeof window !== 'undefined') { // Solo loguear en el cliente
      console.log("Debug primaryService:", primaryService, "typeof:", typeof primaryService, "isArray:", Array.isArray(primaryService));
    }
  }, [primaryService]);


  useEffect(() => {
    // DEBUG: Log dependencies directly inside useEffect before its logic runs
    if (typeof window !== 'undefined') { // Solo loguear en el cliente
      console.log(
        "Deps for date fetch (direct):",
        { val: primaryService, type: typeof primaryService, isArray: Array.isArray(primaryService) },
        { val: cart.length, type: typeof cart.length },
        { val: bookingStep, type: typeof bookingStep },
        { val: currentCalendarMonth, type: typeof currentCalendarMonth },
        { val: cartIdsForEffect, type: typeof cartIdsForEffect, isArray: Array.isArray(cartIdsForEffect) }
      );
    }

    if (primaryService && cart.length > 0 && bookingStep === 'selectDateTime') { // Ensure primaryService is available
      async function fetchDates() {
        setIsLoadingDates(true);
        setAvailableDates([]);
        setSelectedDate(undefined);
        setAvailableTimes([]);
        setSelectedTime(null);
        try {
          const monthStr = format(currentCalendarMonth, 'yyyy-MM');
          // Pass only the primaryService's ID to getAcuityAvailableDates
          const dates = await getAcuityAvailableDates({
            appointmentTypeIDs: [primaryService.id], // Acuity /availability/dates expects a single primary appointmentTypeID
            month: monthStr,
          });
          setAvailableDates(dates);
        } catch (error) {
          setApiError("Could not load available dates for the selected services.");
        } finally {
          setIsLoadingDates(false);
        }
      }
      fetchDates();
    } else if (cart.length === 0 && bookingStep === 'selectDateTime') {
      // If cart becomes empty while on this step, clear dates
      setAvailableDates([]);
      setSelectedDate(undefined);
      setAvailableTimes([]);
      setSelectedTime(null);
    }
  }, [primaryService, cart.length, bookingStep, currentCalendarMonth, cartIdsForEffect]); // Added primaryService and cart.length to dependencies


  useEffect(() => {
    if (primaryService && selectedDate && bookingStep === 'selectDateTime') {
      async function fetchTimes() {
        setIsLoadingTimes(true);
        setAvailableTimes([]);
        setSelectedTime(null);
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const times = await getAcuityAvailableTimes({
            appointmentTypeID: primaryService.id, 
            date: dateStr,
          });
          setAvailableTimes(times);
        } catch (error) {
          setApiError("Could not load available times.");
        } finally {
          setIsLoadingTimes(false);
        }
      }
      fetchTimes();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryService?.id, selectedDate, bookingStep]);
  
  const handleGenderSelect = (gender: 'male' | 'female') => {
      setSelectedGender(gender);
      setBookingStep('selectService');
  }

  const handleAreaClick = (area: 'face' | 'mid' | 'low', readableCategory: string) => {
    if (!selectedGender) {
        toast({ title: "Please select a gender category first.", variant: "default" });
        return;
    }
    const servicesForArea = categorizeServicesForArea(allAppointmentTypes, selectedGender, area);
    setServicesForSelectedArea(servicesForArea); // Actualiza la lista de servicios para la columna derecha
    setSelectedAreaTitle(readableCategory);   // Actualiza el título para la columna derecha
    // setIsModalOpen(false); // Ya no es necesario
  };
  
  const handleAddToCart = (service: AcuityAppointmentType) => {
      const isInCart = cart.some(item => item.id === service.id);
      if (isInCart) {
          toast({ title: "Service Already Added", description: `${service.name} is already in your appointment.`, variant: "default" });
          return;
      }
      toast({ title: "Service Added!", description: `${service.name} has been added to your appointment.`, variant: "default" });
      setCart(prevCart => [...prevCart, service]);
    // setIsModalOpen(false); // Ya no es necesario
  };
  
  const handleRemoveFromCart = (serviceId: number) => {
      setCart(prevCart => prevCart.filter(item => item.id !== serviceId));
  };
  
  const onSubmitClientDetails: SubmitHandler<ClientDetailsFormData> = async (data) => {
    if (!primaryService || !selectedDate || !selectedTime) return;
    
    setIsBooking(true);
    
    const addonIDs = cart.filter(s => s.id !== primaryService.id).map(s => s.id);
    
    const selectedTimeSlot = availableTimes.find(t => t.time === selectedTime);
    if (!selectedTimeSlot) {
        setApiError("Selected time is no longer available.");
        setIsBooking(false);
        return;
    }

    const bookingInput: CreateAcuityAppointmentInput = {
      appointmentTypeID: primaryService.id,
      datetime: selectedTime,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      addonIDs: addonIDs,
      calendarID: selectedTimeSlot.calendarID,
    };

    try {
      const confirmation = await createAcuityAppointment(bookingInput);
      setBookingConfirmation(confirmation);

      if (confirmation.paid?.toLowerCase() !== 'yes' && confirmation.paid?.toLowerCase() !== 'paid' && parseFloat(confirmation.price) > 0) {
        setBookingStep('payment');
      } else {
        toast({ title: "Success!", description: "Your appointment has been booked.", variant: "default" });
        setBookingStep('confirmation');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setApiError(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    setCart([]);
    setBookingStep('selectGender');
    setSelectedGender(null);
    setServicesForSelectedArea([]); // Resetea la lista de servicios del área
    setSelectedAreaTitle('');       // Resetea el título del área
    setSelectedDate(undefined);
    setSelectedTime(null);
    setBookingConfirmation(null);
    form.reset();
  };

  const disabledDateMatcher = (date: Date) => {
    if (isLoadingDates) return true;
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date < today) return true;
    const dateStr = format(date, 'yyyy-MM-dd');
    return !availableDates.includes(dateStr);
  };
  
  const totalCost = useMemo(() => cart.reduce((total, service) => total + parseFloat(service.price), 0), [cart]);
  const totalDuration = useMemo(() => cart.reduce((total, service) => total + service.duration, 0), [cart]);


  if (isLoading) {
    return <div className="flex justify-center items-center py-10 min-h-[400px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (allAppointmentTypes.length === 0 && !isLoading) {
     return <Card className="shadow-xl text-center p-8"><AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" /><CardTitle>No Services Available</CardTitle><p className="mt-4">We couldn't find any services to book at the moment. Please check back later.</p></Card>
  }

  return (
    <Card className="w-full shadow-xl">
      
      {/* {isModalOpen && <ServiceSelectionModal services={servicesForSelectedArea} onAdd={handleAddToCart} onClose={() => setIsModalOpen(false)} categoryTitle={selectedAreaTitle} />} */}
      
      {bookingStep === 'selectGender' && (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">1. Choose Service Category</CardTitle>
                <CardDescription>To begin, please select who the appointment is for.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
                <Button onClick={() => handleGenderSelect('female')} className="w-full sm:w-auto text-lg py-8 px-10 bg-[#D8006E] hover:bg-[#b8005e]">
                    <Sparkles className="mr-3 h-6 w-6" />
                    Female Services
                </Button>
                <Button onClick={() => handleGenderSelect('male')} className="w-full sm:w-auto text-lg py-8 px-10 bg-[#7400D8] hover:bg-[#5e00b0]">
                    <User className="mr-3 h-6 w-6" />
                    Male Services
                </Button>
            </CardContent>
        </>
      )}

      {bookingStep === 'selectService' && selectedGender && (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">2. Choose Your Services</CardTitle>
                <CardDescription>Click on a body area to see available services. Add one or more to your cart.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
                {/* Columna Izquierda: Mapa Corporal */}
                <div className="md:col-span-5 lg:col-span-4">
                    <div className="relative w-full max-w-xs mx-auto aspect-[3/4] md:max-w-sm">
                        <Image 
                            src={selectedGender === 'female' ? "https://static.wixstatic.com/media/c5947c_86a4d139ddf84a1abc29777a63ed8aee~mv2.jpg" : "https://static.wixstatic.com/media/c5947c_272dc65a82734c72833b063afa275335~mv2.jpg"}
                            alt={selectedGender === 'female' ? "Female body map for services" : "Male body map for services"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" // Ajusta según tus breakpoints
                            style={{objectFit: "contain"}}
                            priority
                        />
                        {selectedGender === 'female' ? (
                            <>
                            <ServiceArea position="top-[8%] left-1/2 -translate-x-1/2" label="Face Services" onClick={() => handleAreaClick('face', 'Female Face Services')} />
                            <ServiceArea position="top-[28%] left-1/2 -translate-x-1/2" label="Mid Body Services" onClick={() => handleAreaClick('mid', 'Female Mid Body Services')} />
                            <ServiceArea position="top-[50%] left-1/2 -translate-x-1/2" label="Low Body Services" onClick={() => handleAreaClick('low', 'Female Low Body Services')} /> {/* Subido de 65% a 50% */}
                            </>
                        ) : (
                             <>
                            <ServiceArea position="top-[7%] left-1/2 -translate-x-1/2" label="Face Services" onClick={() => handleAreaClick('face', 'Male Face Services')} />
                            <ServiceArea position="top-[26%] left-1/2 -translate-x-1/2" label="Mid Body Services" onClick={() => handleAreaClick('mid', 'Male Mid Body Services')} />
                            <ServiceArea position="top-[48%] left-1/2 -translate-x-1/2" label="Low Body Services" onClick={() => handleAreaClick('low', 'Male Low Body Services')} /> {/* Subido de 62% a 48% */}
                            </>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Lista de Servicios y Carrito */}
                <div className="md:col-span-7 lg:col-span-8 space-y-6">
                    {/* Columna Derecha: Lista de Servicios */}
                    <div className="p-1"> {/* Añadido padding ligero para que no pegue al borde de la card */}
                        {selectedAreaTitle ? (
                            <>
                                <h3 className="text-xl font-semibold mb-4 text-primary">{selectedAreaTitle}</h3>
                                {servicesForSelectedArea.length > 0 ? (
                                    <ul className="space-y-3 max-h-[calc(100vh-400px)] md:max-h-[50vh] overflow-y-auto pr-2"> {/* Ajustar max-h según necesidad */}
                                        {servicesForSelectedArea.map(service => (
                                            <li 
                                                key={service.id} 
                                                onClick={() => handleAddToCart(service)} 
                                                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-start transition-colors shadow-sm hover:shadow-md" // Changed to items-start for better alignment with image
                                            >
                                                {/* Columna de la Imagen */}
                                                {service.image && (
                                                    <div className="relative w-16 h-16 md:w-20 md:h-20 mr-4 flex-shrink-0 rounded overflow-hidden bg-muted">
                                                        <Image
                                                            src={service.image}
                                                            alt={service.name}
                                                            fill
                                                            sizes="(max-width: 768px) 20vw, 10vw"
                                                            style={{ objectFit: 'cover' }}
                                                            className="transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                )}
                                                {/* Columna de Información del Servicio */}
                                                <div className="flex-grow">
                                                    <h4 className="font-semibold">{service.name}</h4>
                                                    {service.description && <p className="text-sm text-muted-foreground max-w-prose line-clamp-2">{service.description}</p>} {/* line-clamp para descripciones */}
                                                </div>
                                                {/* Columna de Precio/Duración */}
                                                <div className="text-right flex-shrink-0 ml-4">
                                                    <p className="font-bold text-lg text-primary">${service.price}</p>
                                                    <p className="text-sm text-muted-foreground">{service.duration} min</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No services found for this body part. Please select another area or check back later.</p>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-10 px-4">
                                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">View Services</h3>
                                <p className="text-sm text-muted-foreground">Please click on a body area from the diagram on the left to see the list of available services.</p>
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="pt-6 border-t">
                            <h3 className="text-lg font-semibold flex items-center mb-4"><ShoppingCart className="mr-2 h-5 w-5" /> Your Appointment</h3>
                            <ul className="space-y-2">
                               {cart.map(item => (
                                   <li key={item.id} className="flex justify-between items-center bg-secondary/50 p-3 rounded-md">
                                       <div>
                                         <p className="font-semibold">{item.name}</p>
                                         <p className="text-sm text-muted-foreground">${item.price}</p>
                                       </div>
                                       <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                   </li>
                               ))}
                            </ul>
                             <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${totalCost.toFixed(2)} ({totalDuration} min)</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-6"> {/* Añadido margen superior al footer */}
                 <Button variant="outline" onClick={() => {
                    setBookingStep('selectGender');
                    setServicesForSelectedArea([]); // Limpia los servicios del área al volver
                    setSelectedAreaTitle('');       // Limpia el título del área
                 }}>Back</Button>
                 <Button onClick={() => setBookingStep('selectDateTime')} disabled={cart.length === 0}>
                    Proceed to Select Date & Time <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </>
      )}

      {bookingStep === 'selectDateTime' && cart.length > 0 && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center"><CalendarDays className="mr-3 h-7 w-7 text-accent" />3. Select Date & Time</CardTitle>
            <CardDescription>Booking based on availability for all selected services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-2 block">Available Dates</Label>
              {isLoadingDates ? <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin" /></div> : 
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} month={currentCalendarMonth} onMonthChange={setCurrentCalendarMonth} disabled={disabledDateMatcher} className="rounded-md border p-0" />
              }
               {!isLoadingDates && availableDates.length === 0 && <p className="text-muted-foreground font-body mt-2">No dates available for this combination of services in the selected month. Try a different month or modify your services.</p>}
            </div>

            {selectedDate && (
              <div>
                <Label className="text-lg font-semibold mb-2 block">Available Times for {format(selectedDate, "PPP")}</Label>
                {isLoadingTimes && <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {!isLoadingTimes && availableTimes.length > 0 && (
                  <RadioGroup value={selectedTime || ""} onValueChange={setSelectedTime} className="grid grid-cols-3 gap-2 md:grid-cols-4">
                    {availableTimes.map(timeSlot => (
                      <Label key={timeSlot.time} htmlFor={timeSlot.time} className={`font-body flex items-center justify-center rounded-md border p-3 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors ${selectedTime === timeSlot.time ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : ''}`}>
                        <RadioGroupItem value={timeSlot.time} id={timeSlot.time} className="sr-only" /><Clock className="mr-2 h-4 w-4" /> {format(parseISO(timeSlot.time), "p")}
                      </Label>
                    ))}
                  </RadioGroup>
                )}
                 {!isLoadingTimes && availableTimes.length === 0 && <p className="text-muted-foreground">No times available for this date. Please select another.</p>}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setBookingStep(serviceIdsParam ? 'selectGender' : 'selectService')}>Back to Services</Button>
            <Button onClick={() => setBookingStep('enterDetails')} disabled={!selectedTime}>Next: Your Details</Button>
          </CardFooter>
        </>
      )}

      {bookingStep === 'enterDetails' && cart.length > 0 && selectedDate && selectedTime && (
         <>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center"><User className="mr-3 h-7 w-7 text-accent" />4. Your Details</CardTitle>
            <CardDescription>Confirming appointment for <strong>{format(selectedDate, "PPP")} at {selectedTime ? format(parseISO(selectedTime), "p") : ''}</strong>.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitClientDetails)}>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-md border border-border">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <ul className="space-y-1 text-sm">
                        {cart.map(s => <li key={s.id} className="flex justify-between"><span>{s.name}</span><span>${s.price}</span></li>)}
                    </ul>
                    <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                        <span>Total</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} placeholder="Jane" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} placeholder="Doe" /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} placeholder="jane.doe@example.com" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} placeholder="555-123-4567" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Input {...field} placeholder="Any special requests?" /></FormControl><FormMessage /></FormItem>)} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setBookingStep('selectDateTime')} type="button">Back</Button>
                <Button type="submit" disabled={isBooking}>{isBooking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Booking...</> : "Reserve Appointment"}</Button>
              </CardFooter>
            </form>
          </Form>
        </>
      )}
      
      {bookingStep === 'payment' && bookingConfirmation && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <CreditCard className="mr-3 h-7 w-7 text-accent" />
                5. Complete Your Payment
            </CardTitle>
            <CardDescription>
                Your appointment slot is reserved. Please complete the secure payment to finalize your booking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-md border border-border">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <p><strong>Service(s):</strong> {cart.map(s => s.name).join(', ')}</p>
                <p><strong>Date:</strong> {format(parseISO(bookingConfirmation.datetime), "EEEE, MMMM d, yyyy 'at' p")}</p>
                <p className="text-lg font-bold mt-2"><strong>Total:</strong> ${bookingConfirmation.price}</p>
            </div>
            <p className="text-sm text-muted-foreground">
                You will be redirected to the Acuity Scheduling secure payment portal. Your payment information is not handled or stored on our site.
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-3 items-stretch">
             <Button asChild size="lg" className="w-full">
                <a href={bookingConfirmation.confirmationPage} target="_blank" rel="noopener noreferrer" onClick={() => { 
                    toast({ title: "Appointment Reserved!", description: "Please complete payment to fully confirm." });
                    setBookingStep('confirmation');
                }}>
                    Proceed to Secure Payment
                </a>
             </Button>
             <Button variant="link" onClick={() => {
                toast({ title: "Appointment Reserved", description: "You can complete payment later from your confirmation email." });
                setBookingStep('confirmation');
             }}>
                Pay Later
             </Button>
          </CardFooter>
        </>
      )}

      {bookingStep === 'confirmation' && bookingConfirmation && (
        <>
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl text-primary">Appointment Reserved!</CardTitle>
            <CardDescription className="max-w-md mx-auto">
                Thank you, {bookingConfirmation.firstName}! A confirmation email has been sent to <strong>{bookingConfirmation.email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <p><strong>Service(s):</strong> {cart.map(s => s.name).join(', ')}</p>
            <p><strong>Date:</strong> {format(parseISO(bookingConfirmation.datetime), "EEEE, MMMM d, yyyy 'at' p")}</p>
            {bookingConfirmation.notes && <p className="text-sm text-muted-foreground pt-2"><strong>Notes:</strong> {bookingConfirmation.notes}</p>}
            <p className="text-sm text-muted-foreground pt-4">
                You can manage your appointment, including payment, via the link in your email or by visiting: <a href={bookingConfirmation.confirmationPage} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-accent">Acuity Management Page</a>
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={resetBooking}>Book Another Appointment</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
