
import AcuityScheduler from '@/components/shared/AcuityScheduler';
import { Suspense } from 'react';
import Image from 'next/image';

function BookingPageContent() {
  return <AcuityScheduler />;
}

export default function BookingPage() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-background to-purple-50 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
             <Image src="https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png" alt="" width={40} height={40} className="mr-3 h-10 w-10" />
            Create Your Perfect Appointment
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto font-body">
            Select your desired service, date, and time below to book your appointment.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
           <Suspense fallback={<div className="text-center p-12 h-[800px]">Loading Scheduler...</div>}>
            <BookingPageContent />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
