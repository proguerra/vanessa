
'use client';

import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface AcuityEmbedProps {
  ownerId: string;
}

export default function AcuityEmbed({ ownerId }: AcuityEmbedProps) {
  const searchParams = useSearchParams();
  
  // Forward specific acuity params. Acuity uses appointmentTypeID or a categoryID
  const appointmentTypeID = searchParams.get('serviceIds') || searchParams.get('appointmentTypeID');
  const category = searchParams.get('category');
  
  const acuityParams = new URLSearchParams();
  if (appointmentTypeID) {
    // Acuity can handle multiple appointmentTypeIDs
    acuityParams.set('appointmentTypeID', appointmentTypeID);
  }
  if (category) {
    acuityParams.set('category', category);
  }
  
  const acuityUrl = `https://app.acuityscheduling.com/schedule.php?owner=${ownerId}&${acuityParams.toString()}`;

  if (!ownerId) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              The Acuity Scheduling Owner ID is not configured. Please set ACUITY_USER_ID in your environment variables.
            </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <iframe
      src={acuityUrl}
      title="Schedule Appointment"
      width="100%"
      style={{ minHeight: '800px', border: '0' }}
    />
  );
}
