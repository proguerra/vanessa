'use client'; 

import React, { Suspense } from 'react';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function SchedulerIframe() {
  const searchParams = useSearchParams();
  const acuityOwnerID = '33624155';
  const appointmentType = searchParams.get('appointmentType');

  let iframeSrc = `https://app.acuityscheduling.com/schedule.php?owner=${acuityOwnerID}&ref=embedded_csp`;

  if (appointmentType) {
    iframeSrc += `&appointmentType=${appointmentType}`;
  }

  return (
    <div className="aspect-w-16 aspect-h-9 md:aspect-none" style={{ minHeight: '800px' }}>
      <iframe 
        src={iframeSrc} 
        title="Schedule Appointment" 
        width="100%" 
        height="800"
        frameBorder="0"
        loading="lazy"
      ></iframe>
    </div>
  );
}

function SchedulerFallback() {
  return (
    <div className="flex justify-center items-center" style={{ minHeight: '800px' }}>
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">Schedule Your Appointment</CardTitle>
            <CardDescription className="text-lg font-body text-muted-foreground mt-2">
              Please use the scheduler below to book your services.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <Suspense fallback={<SchedulerFallback />}>
              <SchedulerIframe />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <Script 
        src="https://embed.acuityscheduling.com/js/embed.js" 
        type="text/javascript"
        strategy="lazyOnload"
      />
    </div>
  );
}

