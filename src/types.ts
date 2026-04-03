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

export interface Settings {
  departmentName: string;
  institutionName: string;
  logo?: string;
}

export interface AppState {
  activities: Activity[];
  reports: Report[];
  orgPositions: OrgPosition[];
  documents: Document[];
  unitFiles: UnitFile[];
  settings: Settings;
}
