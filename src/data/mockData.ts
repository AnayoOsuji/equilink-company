import { StudentProfile, StatusLog, IncidentAlert, ScheduleItem, SleepLog } from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  id: 'stu_leo_01',
  name: 'Leo Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=250',
  age: 8,
  grade: '3rd Grade',
  school: 'Oakwood Elementary School',
  primaryTeacher: 'Ms. Clara Davis',
  parentName: 'Sarah & David Chen',
  sensoryTriggers: [
    'Loud bell sound in gym',
    'Unannounced teacher substitutions',
    'Bright fluorescent flicker in Cafeteria',
    'Crowded hallway noise'
  ],
  calmingPreferences: [
    'Noise-canceling headphones',
    'Weighted lap blanket (6 lbs)',
    '15-minute quiet dim tent session',
    'Tactile pop-it square & soft chewable necklace',
    'Listening to rain sounds on tablet'
  ],
  iepGoalsSummary: 'IEP Goal 3.2: Self-advocate for sensory break when energy drops or anxiety reaches yellow/high level. Goal 4.1: Seamless transition between visual schedule activities.'
};

export const INITIAL_LOGS: StatusLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-07-22T08:15:00',
    date: '2026-07-22',
    time: '08:15 AM',
    mood: 'calm',
    energy: 'moderate',
    sensory: 'low',
    contextTag: 'Morning Arrival',
    loggedBy: 'Sarah Chen (Mom)',
    role: 'parent',
    notes: 'Ate full breakfast. Slept 8.5 hrs. In good spirits heading to bus.'
  },
  {
    id: 'log_02',
    timestamp: '2026-07-22T09:30:00',
    date: '2026-07-22',
    time: '09:30 AM',
    mood: 'focused',
    energy: 'high',
    sensory: 'low',
    contextTag: 'Reading Circle',
    loggedBy: 'Ms. Clara Davis',
    role: 'educator',
    notes: 'Engaged with visual book. Used fidget cube during turn.'
  },
  {
    id: 'log_03',
    timestamp: '2026-07-22T10:15:00',
    date: '2026-07-22',
    time: '10:15 AM',
    mood: 'anxious',
    energy: 'high',
    sensory: 'high',
    contextTag: 'Gym Class',
    loggedBy: 'Mr. Vance (PE)',
    role: 'educator',
    notes: 'Echo in gym caused mild ear covering. Donned noise-canceling headphones.',
    flaggedAsIncident: true
  },
  {
    id: 'log_04',
    timestamp: '2026-07-22T11:45:00',
    date: '2026-07-22',
    time: '11:45 AM',
    mood: 'calm',
    energy: 'moderate',
    sensory: 'low',
    contextTag: 'Decompression Corner',
    loggedBy: 'Ms. Clara Davis',
    role: 'educator',
    notes: 'Spent 10 mins with weighted lap pad after Gym. Regulated quickly.'
  },
  {
    id: 'log_05',
    timestamp: '2026-07-21T14:10:00',
    date: '2026-07-21',
    time: '02:10 PM',
    mood: 'overwhelmed',
    energy: 'low',
    sensory: 'overloaded',
    contextTag: 'Math / Surprise Assembly',
    loggedBy: 'Ms. Clara Davis',
    role: 'educator',
    notes: 'Unplanned fire drill bell rang during Math test.',
    flaggedAsIncident: true
  },
  {
    id: 'log_06',
    timestamp: '2026-07-21T08:00:00',
    date: '2026-07-21',
    time: '08:00 AM',
    mood: 'tired',
    energy: 'low',
    sensory: 'high',
    contextTag: 'Morning Bus',
    loggedBy: 'Sarah Chen (Mom)',
    role: 'parent',
    notes: 'Only 6 hrs sleep due to neighbor storm noise last night.'
  }
];

export const INITIAL_INCIDENTS: IncidentAlert[] = [
  {
    id: 'inc_101',
    timestamp: '2026-07-22T10:18:00',
    date: '2026-07-22',
    time: '10:18 AM',
    title: 'High Echo Noise in Gym Class',
    description: 'Bouncing basketballs and whistle created high auditory sensory load. Leo requested headphones and took a 5-min breather.',
    location: 'school',
    severity: 'mild',
    parentAcknowledged: true,
    teacherNotified: true,
    loggedBy: 'Mr. Vance (PE Teacher)',
    role: 'educator',
    completedSteps: ['Weighted Blanket Ready'],
    decompressionStrategies: [
      {
        title: 'Low-Stimulation Arrival',
        action: 'Allow 20 minutes in dim quiet room with favorite train book right after getting off bus.',
        targetSensory: 'Auditory Decompression'
      },
      {
        title: 'Deep Pressure Touch',
        action: 'Apply 6lb weighted lap pad or tight squeeze hug for 10 minutes.',
        targetSensory: 'Proprioceptive Reset'
      },
      {
        title: 'Hydration & Crunchy Snack',
        action: 'Offer ice water and pretzel sticks to provide oral sensory grounding.',
        targetSensory: 'Oral / Tactile Grounding'
      }
    ]
  },
  {
    id: 'inc_100',
    timestamp: '2026-07-21T14:12:00',
    date: '2026-07-21',
    time: '02:12 PM',
    title: 'Unannounced Loud Fire Drill Alarm',
    description: 'Loud bell rang without prior notice. Leo covered ears and crouched. Teacher guided to quiet zone immediately.',
    location: 'school',
    severity: 'high',
    parentAcknowledged: true,
    teacherNotified: true,
    loggedBy: 'Ms. Clara Davis',
    role: 'educator',
    completedSteps: ['Low-Stimulation Arrival', 'Deep Pressure Touch', 'Hydration & Crunchy Snack'],
    decompressionStrategies: [
      {
        title: 'Dim Lighting & Rain Sounds',
        action: 'Set bedroom lights to warm dim orange, play rain sounds at 30% volume.',
        targetSensory: 'Visual & Auditory Rest'
      },
      {
        title: 'Zero-Demand Transition',
        action: 'Avoid asking "How was your school day?" for the first hour. Let Leo initiate when comfortable.',
        targetSensory: 'Cognitive De-escalation'
      }
    ]
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch_1',
    timeSlot: '08:30 AM',
    title: 'Morning Arrival & Visual Check-in',
    location: 'Room 104',
    iconName: 'Sun',
    category: 'home_routine',
    isCompleted: true,
    isCurrent: false
  },
  {
    id: 'sch_2',
    timeSlot: '09:00 AM',
    title: 'Language Arts & Reading Circle',
    location: 'Room 104',
    iconName: 'BookOpen',
    category: 'classroom',
    isCompleted: true,
    isCurrent: false
  },
  {
    id: 'sch_3',
    timeSlot: '10:00 AM',
    title: 'Physical Education / Gym',
    location: 'Gymnasium',
    iconName: 'Dumbbell',
    category: 'special',
    isCompleted: true,
    isCurrent: false,
    isChanged: true,
    changeNotice: 'Indoor Gym due to rain (Higher noise expected)'
  },
  {
    id: 'sch_4',
    timeSlot: '11:00 AM',
    title: 'Sensory Reset & Decompression',
    location: 'Sensory Corner',
    iconName: 'Feather',
    category: 'break',
    isCompleted: true,
    isCurrent: false
  },
  {
    id: 'sch_5',
    timeSlot: '11:30 AM',
    title: 'Lunch & Recess',
    location: 'Cafeteria / Quiet Courtyard',
    iconName: 'Utensils',
    category: 'break',
    isCompleted: false,
    isCurrent: true
  },
  {
    id: 'sch_6',
    timeSlot: '12:30 PM',
    title: 'Math & STEM Workshop',
    location: 'Room 104',
    iconName: 'Calculator',
    category: 'classroom',
    isCompleted: false,
    isCurrent: false
  },
  {
    id: 'sch_7',
    timeSlot: '01:45 PM',
    title: 'Art & Tactile Creation',
    location: 'Art Studio',
    iconName: 'Palette',
    category: 'special',
    isCompleted: false,
    isCurrent: false,
    isChanged: true,
    changeNotice: 'Substitute Art Teacher (Ms. Gable)'
  },
  {
    id: 'sch_8',
    timeSlot: '02:45 PM',
    title: 'Pack Up & Bus Transition',
    location: 'Bus Loading Zone',
    iconName: 'Bus',
    category: 'home_routine',
    isCompleted: false,
    isCurrent: false
  }
];

export const INITIAL_SLEEP_LOGS: SleepLog[] = [
  {
    id: 'slp_1',
    date: '2026-07-22',
    hoursSlept: 8.5,
    sleepQuality: 'restful',
    bedtime: '08:30 PM',
    wakeTime: '07:00 AM',
    notes: 'Slept through night smoothly. White noise machine on.'
  },
  {
    id: 'slp_2',
    date: '2026-07-21',
    hoursSlept: 6.0,
    sleepQuality: 'frequent_wakes',
    bedtime: '09:45 PM',
    wakeTime: '06:15 AM',
    notes: 'Thunderstorm woke Leo twice. Needed soothing.'
  },
  {
    id: 'slp_3',
    date: '2026-07-20',
    hoursSlept: 8.0,
    sleepQuality: 'restful',
    bedtime: '08:45 PM',
    wakeTime: '06:45 AM',
    notes: 'Calm evening routine.'
  },
  {
    id: 'slp_4',
    date: '2026-07-19',
    hoursSlept: 7.2,
    sleepQuality: 'restless',
    bedtime: '09:00 PM',
    wakeTime: '06:30 AM',
    notes: 'Tossed and turned before falling asleep.'
  },
  {
    id: 'slp_5',
    date: '2026-07-18',
    hoursSlept: 8.8,
    sleepQuality: 'restful',
    bedtime: '08:30 PM',
    wakeTime: '07:18 AM',
    notes: 'Great weekend sleep.'
  }
];
