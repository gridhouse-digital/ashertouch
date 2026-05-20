export type RateCategoryTone = 'green' | 'blue' | 'orange';
export type RateExemptTone = 'green' | 'stone';

export type RateService = {
  category: string;
  categoryTone: RateCategoryTone;
  name: string;
  description: string;
  amount: string;
  unit: string;
  exempt: string;
  exemptTone: RateExemptTone;
};

export type RateCondition =
  | { label: string; text: string }
  | { label: string; before: string; emphasis: string; after: string };

export const rateSchedule = {
  effectiveLabel: 'Rate Schedule · Effective 2025',
  title: 'Our Services & Rates',
  intro:
    'Compassionate non-medical home care for seniors and families — flexible schedules, carefully screened caregivers, free in-home assessment.',
  services: [
    {
      category: 'Companion & Support',
      categoryTone: 'green',
      name: 'Home Support Services',
      description:
        'Friendly check-in visits, companionship and social engagement, errands and shopping, meal planning and preparation, light housekeeping, laundry, accompaniment to appointments, and incidental transportation.',
      amount: '$36',
      unit: 'per hour',
      exempt: 'HST-exempt',
      exemptTone: 'green',
    },
    {
      category: 'Personal Care',
      categoryTone: 'blue',
      name: 'Personal Care (PSW)',
      description:
        'Personal Support Workers provide respectful assistance with the private activities of daily living — hygiene, grooming, toileting, dressing, medication reminders, and safe mobility support.',
      amount: '$36',
      unit: 'per hour',
      exempt: 'HST-exempt',
      exemptTone: 'green',
    },
    {
      category: '24-Hour & Continuous',
      categoryTone: 'blue',
      name: '24-Hour Care',
      description:
        'Continuous care in two 12-hour or three 8-hour shifts, ensuring a caregiver is always awake, alert, and available to attend to all care needs around the clock.',
      amount: '$36',
      unit: 'per hour',
      exempt: 'HST-exempt',
      exemptTone: 'green',
    },
    {
      category: 'Residential',
      categoryTone: 'orange',
      name: 'Live-In Care',
      description:
        "A caregiver resides in the client's home for extended daily support. Rate varies based on caregiver qualifications, accommodations, and term length. Room and board are the client's responsibility. Not suitable for 24-hour active care. Contact us to discuss.",
      amount: '$400',
      unit: 'per day',
      exempt: 'by arrangement',
      exemptTone: 'stone',
    },
  ] as const satisfies readonly RateService[],
  conditions: [
    {
      label: 'Minimum visit',
      text: '3-hour minimum per visit for all PSW and companion services.',
    },
    {
      label: 'Statutory holidays',
      before: 'All statutory holiday bookings are billed at ',
      emphasis: '1.5×',
      after: ' the standard hourly rate.',
    },
    {
      label: 'Mileage',
      before: "Caregiver's personal vehicle used for errands, shopping, or appointments: ",
      emphasis: '$0.73 / km',
      after: '.',
    },
    {
      label: 'Invoicing',
      before: 'Invoiced bi-weekly. Payment due on receipt. Accepted: ',
      emphasis: 'e-transfer, cheque, credit card',
      after: '.',
    },
    {
      label: 'HST',
      text: 'Non-medical personal care and companion services are generally HST-exempt under the Excise Tax Act (Canada). Please confirm with your accountant.',
    },
    {
      label: 'Caregivers',
      text: 'All AsherTouch caregivers are personally interviewed, Vulnerable Sector checked, reference-verified, and supervised under general liability insurance.',
    },
  ] as const satisfies readonly RateCondition[],
};
