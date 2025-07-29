import type { AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';

/**
 * Checks if a service is explicitly for men based on keywords in its name.
 * A service is considered for men if its name contains "men's" or "gentleman".
 * @param serviceName - The name of the service.
 * @returns True if the service is for men, false otherwise.
 */
function isMaleService(serviceName: string): boolean {
  const name = serviceName.toLowerCase();
  const maleKeywords = ["men's", "gentleman"];
  return maleKeywords.some(kw => name.includes(kw));
}

export function categorizeServicesForArea(
  allServices: AcuityAppointmentType[],
  gender: 'male' | 'female',
  area: 'face' | 'mid' | 'low'
): AcuityAppointmentType[] {

  const faceKeywords = ['nose', 'lip', 'chin', 'brow', 'eyebrow', 'face', 'sideburn', 'ear', 'facial'];
  const midKeywords = ['back', 'chest', 'stomach', 'underarm', 'arm'];
  const lowKeywords = ['leg', 'butt', 'brazilian', 'bikini'];

  // 1. First, filter the services based on the selected gender using keywords.
  const genderFilteredServices = allServices.filter(service => {
    if (gender === 'male') {
      return isMaleService(service.name);
    } else { // gender === 'female'
      // A service is considered for women if it's NOT explicitly for men.
      return !isMaleService(service.name);
    }
  });

  // 2. From the gender-filtered list, categorize by body area.
  return genderFilteredServices.filter(service => {
    const serviceName = service.name.toLowerCase();
    switch (area) {
      case 'face':
        return faceKeywords.some(kw => serviceName.includes(kw));
      case 'mid':
        return midKeywords.some(kw => serviceName.includes(kw));
      case 'low':
        return lowKeywords.some(kw => serviceName.includes(kw));
      default:
        return false;
    }
  });
}
