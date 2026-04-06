export interface Activity {
  id: string;
  name: string;
  date?: string;
  months: string[];
  unit: string;
  action?: string;
  status: string;
  createdAt: string;
}

export interface Report {
  id: string;
  programName: string;
  unit: string;
  date: string;
  place: string;
  involvement?: string;
  feedback?: string;
  notes?: string;
  issues?: string;
  attachments?: string[];
  createdAt: string;
}

export interface OrgPosition {
  id: string;
  position: string;
  name: string;
  photo?: string;
  level: string;
  parentId?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  type: string;
  title: string;
  ref?: string;
  date: string;
  description?: string;
  file?: string;
  createdAt: string;
}

export interface UnitFile {
  id: string;
  unitName: string;
  title: string;
  description?: string;
  fileData?: string;
  fileType?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isImportant: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface StudentForm {
  id: string;
  title: string;
  description: string;
  fileData?: string;
  externalLink?: string;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  studentName: string;
  studentId: string;
  formTitle: string;
  submissionDate: string;
  fileData: string;
  status: 'pending' | 'reviewed' | 'completed';
  createdAt: string;
}

export interface Settings {
  departmentName: string;
  institutionName: string;
  logo?: string;
  operatingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
  announcementInfo?: string;
  schoolCode?: string;
  address?: string;
}

export interface AppState {
  activities: Activity[];
  reports: Report[];
  orgPositions: OrgPosition[];
  documents: Document[];
  unitFiles: UnitFile[];
  announcements: Announcement[];
  studentForms: StudentForm[];
  submissions: FormSubmission[];
  settings: Settings;
}
