import type { AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';

export function categorizeServicesForArea(
  allServices: AcuityAppointmentType[],
  gender: 'male' | 'female',
  area: 'face' | 'mid' | 'low'
): AcuityAppointmentType[] {

  const faceKeywords = ['nose', 'lip', 'chin', 'brow', 'eyebrow', 'face', 'sideburn', 'ear', 'facial'];
  const midKeywords = ['back', 'chest', 'stomach', 'underarm', 'arm'];
  // Low body keywords are more complex and gender-specific
  const lowBodyFemaleKeywords = ['leg', 'butt', 'brazilian', 'bikini', "woman's", "women's"];
  const lowBodyMaleKeywords = ['leg', 'butt', 'brazilian', "men's"];


  return allServices.filter(service => {
    const serviceName = service.name.toLowerCase();

    // First, filter by area
    let matchesArea = false;
    switch (area) {
      case 'face':
        matchesArea = faceKeywords.some(kw => serviceName.includes(kw));
        break;
      case 'mid':
        matchesArea = midKeywords.some(kw => serviceName.includes(kw));
        break;
      case 'low':
        if (gender === 'female') {
            matchesArea = lowBodyFemaleKeywords.some(kw => serviceName.includes(kw));
        } else { // male
            matchesArea = lowBodyMaleKeywords.some(kw => serviceName.includes(kw));
        }
        break;
    }

    if (!matchesArea) {
      return false;
    }

    // Second, apply gender-specific exclusions
    if (gender === 'female') {
      // Exclude services that explicitly say "men's" but are not general low body terms
      if (serviceName.includes("men's")) {
        return false;
      }
    }

    if (gender === 'male') {
      // Exclude services that explicitly say "woman's" or are female-specific
      if (serviceName.includes("woman's") || serviceName.includes("women's") || serviceName.includes('bikini line')) {
        return false;
      }
    }

    return true; // If it passes all checks
  });
}
