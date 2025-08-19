"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, ArrowRight, ShoppingCart, Trash2, Sparkles, User as UserIconSmall, CalendarDays } from 'lucide-react'; 

import { getAcuityAppointmentTypes } from '@/ai/flows/acuity-booking-flow';
import type { AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow'; 
import { categorizeServicesForArea } from '@/lib/acuity-helpers';

type BookingStep = 'selectGender' | 'selectService'; 

const ServiceArea = ({ position, label, onClick }: { position: string, label: string, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`absolute ${position} w-24 h-24 rounded-full cursor-pointer flex items-center justify-center text-center p-2 transition-all duration-300 transform hover:scale-110 shadow-md`} 
    >
        <span className="font-semibold text-xs leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">{label}</span>
    </div>
);

export default function AcuityScheduler() {
  const { toast } = useToast();
  const router = useRouter(); 

  const [allAppointmentTypes, setAllAppointmentTypes] = useState<AcuityAppointmentType[]>([]);
  const [cart, setCart] = useState<AcuityAppointmentType[]>([]);
  
  const [bookingStep, setBookingStep] = useState<BookingStep>('selectGender');
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | null>(null);
  
  const [servicesForSelectedArea, setServicesForSelectedArea] = useState<AcuityAppointmentType[]>([]);
  const [selectedAreaTitle, setSelectedAreaTitle] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true); 
  const [apiError, setApiError] = useState<string | null>(null); 

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

  // Carga todos los tipos de cita al montar el componente
  useEffect(() => {
    async function fetchAndSetup() {
      setIsLoading(true);
      try {
        const types = (await getAcuityAppointmentTypes()).filter(type => !type.private);
        setAllAppointmentTypes(types);
      } catch (error) {
        setApiError("Could not load services. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAndSetup();
  }, []);
  
  const handleGenderSelect = (gender: 'male' | 'female') => {
      setSelectedGender(gender);
      setBookingStep('selectService');
      // Limpiar selecciones anteriores al cambiar de género
      setServicesForSelectedArea([]);
      setSelectedAreaTitle('');
      setCart([]);
  }

  const handleAreaClick = (area: 'face' | 'mid' | 'low', readableCategory: string) => {
    if (!selectedGender) return;
    const servicesForArea = categorizeServicesForArea(allAppointmentTypes, selectedGender, area);
    
    // --- DEBUG LOG ---
    console.log("--- DEBUG: Filtering Services ---");
    console.log("Selected Gender:", selectedGender);
    console.log("Selected Area:", area);
    console.log("All Services Available:", allAppointmentTypes);
    console.log("Filtered Services Result:", servicesForArea);
    console.log("---------------------------------");
    
    setServicesForSelectedArea(servicesForArea); 
    setSelectedAreaTitle(readableCategory);   
  };
  
  const handleAddToCart = (service: AcuityAppointmentType) => {
      toast({ title: "Service Selected!", description: `${service.name} has been selected.`, variant: "default" });
      setCart([service]);
  };
  
  const handleRemoveFromCart = (serviceId: number) => {
      setCart(prevCart => prevCart.filter(item => item.id !== serviceId));
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
                    <UserIconSmall className="mr-3 h-6 w-6" />
                    Male Services
                </Button>
            </CardContent>
        </>
      )}

      {bookingStep === 'selectService' && selectedGender && (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">2. Choose Your Services</CardTitle>
                <CardDescription>Click on a body area to select a service. You can add more services once you proceed to schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
                <div className="md:col-span-5 lg:col-span-4">
                    <div className="relative w-full max-w-xs mx-auto aspect-[3/4] md:max-w-sm">
                        <Image 
                            src={selectedGender === 'female' ? "https://static.wixstatic.com/media/c5947c_86a4d139ddf84a1abc29777a63ed8aee~mv2.jpg" : "https://static.wixstatic.com/media/c5947c_272dc65a82734c72833b063afa275335~mv2.jpg"}
                            alt={selectedGender === 'female' ? "Female body map for services" : "Male body map for services"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                            style={{objectFit: "contain"}}
                            priority
                        />
                        {selectedGender === 'female' ? (
                            <>
                            <ServiceArea position="top-[8%] left-1/2 -translate-x-1/2" label="Face Services" onClick={() => handleAreaClick('face', 'Female Face Services')} />
                            <ServiceArea position="top-[28%] left-1/2 -translate-x-1/2" label="Mid Body Services" onClick={() => handleAreaClick('mid', 'Female Mid Body Services')} />
                            <ServiceArea position="top-[50%] left-1/2 -translate-x-1/2" label="Lower Body Services" onClick={() => handleAreaClick('low', 'Female Lower Body Services')} />
                            </>
                        ) : (
                             <>
                            <ServiceArea position="top-[7%] left-1/2 -translate-x-1/2" label="Face Services" onClick={() => handleAreaClick('face', 'Male Face Services')} />
                            <ServiceArea position="top-[26%] left-1/2 -translate-x-1/2" label="Mid Body Services" onClick={() => handleAreaClick('mid', 'Male Mid Body Services')} />
                            <ServiceArea position="top-[48%] left-1/2 -translate-x-1/2" label="Lower Body Services" onClick={() => handleAreaClick('low', 'Male Lower Body Services')} />
                            </>
                        )}
                    </div>
                </div>

                <div className="md:col-span-7 lg:col-span-8 space-y-6">
                    <div className="p-1"> 
                        {selectedAreaTitle ? (
                            <>
                                <h3 className="text-xl font-semibold mb-4 text-primary">{selectedAreaTitle}</h3>
                                {servicesForSelectedArea.length > 0 ? (
                                    <ul className="space-y-3 max-h-[calc(100vh-400px)] md:max-h-[50vh] overflow-y-auto pr-2"> 
                                        {servicesForSelectedArea.map(service => (
                                            <li 
                                                key={service.id} 
                                                onClick={() => handleAddToCart(service)} 
                                                className={`p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-start transition-colors shadow-sm hover:shadow-md ${cart.some(s => s.id === service.id) ? 'ring-2 ring-primary' : ''}`}
                                            >
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
                                                <div className="flex-grow">
                                                    <h4 className="font-semibold">{service.name}</h4>
                                                    {service.description && <p className="text-sm text-muted-foreground max-w-prose line-clamp-2">{service.description}</p>}
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-4">
                                                    <p className="font-bold text-lg text-primary">${service.price}</p>
                                                    <p className="text-sm text-muted-foreground">{service.duration} min</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No services found for this body part. Please select another area.</p>
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
            <CardFooter className="flex justify-between mt-6"> 
                 <Button variant="outline" onClick={() => setBookingStep('selectGender')}>Back</Button>
                 <Button 
                    onClick={() => {
                      if (cart.length === 1 && cart[0]?.id) {
                        router.push(`/schedule?appointmentType=${cart[0].id}`);
                      } else {
                        router.push('/schedule');
                      }
                    }}  
                    disabled={cart.length !== 1}
                 >
                    Proceed to Schedule <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </>
      )}

    </Card>
  );
}
