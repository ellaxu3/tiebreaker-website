import { Decision } from '../types';

export const DECISION_PRESETS: Partial<Decision>[] = [
  {
    title: 'Should I Rent an Apartment or Buy a Starter Condo?',
    description: 'Looking to move closer to the city center. Interest rates are moderately high, but renting feels like throwing money away. Starter condos require a 15% down payment.',
    optionA: 'Rent a luxury apartment in the city center',
    optionB: 'Buy a 2-bedroom starter condo in the suburbs',
    category: 'Finance & Real Estate',
  },
  {
    title: 'Transition from Software Engineer to Product Manager?',
    description: 'Offered an internal lateral move to PM. I enjoy engineering, but want more influence on product strategy. Worried about losing coding skills and dealing with more meeting overhead.',
    optionA: 'Remain as a Senior Software Engineer',
    optionB: 'Accept the internal Product Manager position',
    category: 'Career Growth',
  },
  {
    title: 'Buy a Tesla Model 3 or a Toyota RAV4 Hybrid?',
    description: 'Need a reliable commuter car. I travel 40 miles round-trip daily. Electric is appealing, but we take occasional 400-mile road trips to visit family where charging might be sparse.',
    optionA: 'Purchase Tesla Model 3 (Full Electric)',
    optionB: 'Purchase Toyota RAV4 Hybrid (Gas + Electric)',
    category: 'Lifestyle & Auto',
  },
  {
    title: 'Launch a Bootstrap SaaS vs. Raise VC Funding?',
    description: 'My micro-SaaS is showing early traction (30 paying users). I can slow-build it while keeping 100% equity, or pitch to angel investors for $250k seed funding to hire support.',
    optionA: 'Bootstrap slowly (self-funded)',
    optionB: 'Raise pre-seed venture capital funding',
    category: 'Business & Startup',
  }
];
