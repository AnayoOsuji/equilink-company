export type UserRole = 'educator' | 'parent' | 'student';

export interface UserSession {
  role: UserRole;
  name: string;
  email?: string;
  organization?: string;
  mode: 'login' | 'signup' | 'trial';
  isActivated: boolean;
  loginTime: string;
  lastActiveTime: number;
  sessionToken: string;
  hipaaAcknowledged: boolean;
}

export interface HipaaAuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'USER_LOGIN' | 'USER_LOGOUT' | 'PHI_ACCESSED' | 'INCIDENT_ACKNOWLEDGED' | 'LOG_CREATED' | 'SCHEDULE_MODIFIED' | 'PHI_MASKED' | 'SESSION_TIMEOUT' | 'SECURITY_CHECK';
  resource: string;
  details: string;
  ipHash: string;
}

export type MoodType = 'calm' | 'focused' | 'happy' | 'anxious' | 'overwhelmed' | 'tired';

export type EnergyType = 'low' | 'moderate' | 'high';

export type SensoryType = 'low' | 'medium' | 'high' | 'overloaded';

export interface StatusLog {
  id: string;
  timestamp: string;
  date: string; // e.g. "2026-07-22"
  time: string; // e.g. "10:15 AM"
  mood: MoodType;
  energy: EnergyType;
  sensory: SensoryType;
  contextTag: string;
  loggedBy: string;
  role: UserRole;
  notes?: string;
  flaggedAsIncident?: boolean;
}

export interface DecompressionStrategy {
  title: string;
  action: string;
  targetSensory: string;
}

export interface IncidentAlert {
  id: string;
  timestamp: string;
  time: string;
  date: string;
  title: string;
  description: string;
  location: 'school' | 'home' | 'bus';
  severity: 'mild' | 'moderate' | 'high';
  decompressionStrategies: DecompressionStrategy[];
  parentAcknowledged: boolean;
  teacherNotified: boolean;
  completedSteps?: string[];
  loggedBy: string;
  role: UserRole;
}

export interface ScheduleItem {
  id: string;
  timeSlot: string; // e.g. "09:00 AM"
  title: string;
  location: string;
  iconName: string; // lucide icon identifier
  category: 'classroom' | 'special' | 'break' | 'home_routine';
  isCompleted: boolean;
  isCurrent: boolean;
  isChanged?: boolean;
  changeNotice?: string;
}

export interface SleepLog {
  id: string;
  date: string;
  hoursSlept: number;
  sleepQuality: 'restful' | 'restless' | 'frequent_wakes';
  bedtime: string;
  wakeTime: string;
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl: string;
  age: number;
  grade: string;
  school: string;
  primaryTeacher: string;
  parentName: string;
  sensoryTriggers: string[];
  calmingPreferences: string[];
  iepGoalsSummary: string;
}

export interface AITrendResult {
  primaryPatterns: string[];
  sleepCorrelation: string;
  sensoryTriggers: string[];
  recommendedAccommodations: string[];
  summaryNote: string;
}
