import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState, Activity, Report, OrgPosition, Document, UnitFile, Settings, Announcement, StudentForm, FormSubmission } from './types';
import { io } from 'socket.io-client';

const socket = io({
  transports: ['polling', 'websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const defaultSettings: Settings = {
  departmentName: 'Jabatan Hal Ehwal Pelajar (JHEP)',
  institutionName: 'Kolej Vokasional Beaufort',
  operatingHours: 'Isnin - Jumaat: 8:00 AM - 5:00 PM',
  contactEmail: 'kvbeaufort@moe.edu.my',
  contactPhone: '087-217014',
  schoolCode: 'XHA3102',
  address: 'KM3, Jalan Beaufort - Sipitang, Peti Surat 1011, 89808 Beaufort, Sabah.',
};

const initialState: AppState = {
  activities: [],
  reports: [],
  orgPositions: [],
  documents: [],
  unitFiles: [],
  announcements: [
    {
      id: '1',
      title: 'MAKLUMAN WAKTU OPERASI PEJABAT JHEP',
      content: 'Pejabat JHEP beroperasi dari jam 8:00 pagi hingga 5:00 petang setiap hari bekerja. Sila pastikan urusan dilakukan dalam waktu tersebut.',
      date: '01/04/2026',
      author: 'Ketua JHEP',
      isImportant: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'PENGHANTARAN BORANG KEBAJIKAN PELAJAR',
      content: 'Semua pelajar yang ingin memohon bantuan kebajikan boleh memuat turun borang di Portal Pelajar dan menghantarnya secara digital sebelum 15 April 2026.',
      date: '02/04/2026',
      author: 'Unit Kebajikan',
      isImportant: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'PROGRAM MOTIVASI & SAHSIAH PELAJAR',
      content: 'Jemputan kepada semua pelajar untuk menghadiri program motivasi yang akan diadakan di Dewan Kuliah Utama.',
      date: '03/04/2026',
      author: 'Unit Kaunseling',
      isImportant: false,
      attachments: ['https://picsum.photos/seed/jhep/800/400'],
      createdAt: new Date().toISOString()
    }
  ],
  studentForms: [
    {
      id: 'f1',
      title: 'Borang Kebenaran Keluar',
      description: 'Digunakan untuk memohon kebenaran keluar dari kawasan kolej bagi urusan peribadi.',
      externalLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfD-X_p8_v_x_x_x/viewform',
      createdAt: new Date().toISOString()
    },
    {
      id: 'f2',
      title: 'Borang Tuntutan Insurans',
      description: 'Borang rasmi bagi tuntutan insurans kemalangan pelajar.',
      fileData: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      createdAt: new Date().toISOString()
    }
  ],
  submissions: [],
  settings: defaultSettings,
};

interface User {
  id: string;
  name: string;
  role: 'pensyarah' | 'admin';
}

interface StoreContextType extends AppState {
  isConnected: boolean;
  user: User | null;
  login: (password: string) => boolean;
  logout: () => void;
  
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;

  addOrgPosition: (pos: Omit<OrgPosition, 'id' | 'createdAt'>) => void;
  updateOrgPosition: (id: string, pos: Partial<OrgPosition>) => void;
  deleteOrgPosition: (id: string) => void;

  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  deleteDocument: (id: string) => void;

  addUnitFile: (file: Omit<UnitFile, 'id' | 'createdAt'>) => void;
  updateUnitFile: (id: string, file: Partial<UnitFile>) => void;
  deleteUnitFile: (id: string) => void;

  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, ann: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  addStudentForm: (form: Omit<StudentForm, 'id' | 'createdAt'>) => void;
  updateStudentForm: (id: string, form: Partial<StudentForm>) => void;
  deleteStudentForm: (id: string) => void;

  addSubmission: (sub: Omit<FormSubmission, 'id' | 'createdAt'>) => void;
  updateSubmission: (id: string, sub: Partial<FormSubmission>) => void;
  deleteSubmission: (id: string) => void;

  updateSettings: (settings: Partial<Settings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isRemoteUpdate = useRef(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Check local storage for user session
    const savedUser = localStorage.getItem('jhep_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === 'jhep123') {
      const newUser: User = { id: 'lecturer-1', name: 'Pensyarah JHEP', role: 'pensyarah' };
      setUser(newUser);
      localStorage.setItem('jhep_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jhep_user');
  };

  useEffect(() => {
    console.log('Initializing Socket.io connection...');
    
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      setIsConnected(true);
    });

    socket.on('state:init', (serverState: AppState) => {
      console.log('Received initial state from server');
      if (serverState && Object.keys(serverState).length > 0) {
        setState(s => ({
          ...s,
          ...serverState,
          // Merge with initial state to ensure defaults exist if server is empty
          announcements: serverState.announcements?.length > 0 ? serverState.announcements : s.announcements,
          studentForms: serverState.studentForms?.length > 0 ? serverState.studentForms : s.studentForms,
          settings: serverState.settings && Object.keys(serverState.settings).length > 0 ? serverState.settings : s.settings,
        }));
      }
      isInitialized.current = true;
    });

    // Granular listeners
    const tables = ['activities', 'reports', 'orgPositions', 'documents', 'unitFiles', 'announcements', 'studentForms', 'submissions'];
    
    tables.forEach(table => {
      socket.on(`${table}:added`, (item) => {
        setState(s => ({ ...s, [table]: [...(s as any)[table], item] }));
      });
      socket.on(`${table}:updated`, (item) => {
        setState(s => ({ ...s, [table]: (s as any)[table].map((i: any) => i.id === item.id ? item : i) }));
      });
      socket.on(`${table}:deleted`, (id) => {
        setState(s => ({ ...s, [table]: (s as any)[table].filter((i: any) => i.id !== id) }));
      });
    });

    socket.on('settings:updated', (newSettings) => {
      setState(s => ({ ...s, settings: newSettings }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('state:init');
      tables.forEach(table => {
        socket.off(`${table}:added`);
        socket.off(`${table}:updated`);
        socket.off(`${table}:deleted`);
      });
      socket.off('settings:updated');
      socket.off('disconnect');
    };
  }, []);

  const generateId = () => crypto.randomUUID();

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newItem = { ...activity, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('activities:add', newItem);
  };

  const updateActivity = (id: string, activity: Partial<Activity>) => {
    const current = state.activities.find(a => a.id === id);
    if (current) {
      socket.emit('activities:update', { ...current, ...activity });
    }
  };

  const deleteActivity = (id: string) => {
    socket.emit('activities:delete', id);
  };

  const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    const newItem = { ...report, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('reports:add', newItem);
  };

  const updateReport = (id: string, report: Partial<Report>) => {
    const current = state.reports.find(r => r.id === id);
    if (current) {
      socket.emit('reports:update', { ...current, ...report });
    }
  };

  const deleteReport = (id: string) => {
    socket.emit('reports:delete', id);
  };

  const addOrgPosition = (pos: Omit<OrgPosition, 'id' | 'createdAt'>) => {
    const newItem = { ...pos, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('orgPositions:add', newItem);
  };

  const updateOrgPosition = (id: string, pos: Partial<OrgPosition>) => {
    const current = state.orgPositions.find(o => o.id === id);
    if (current) {
      socket.emit('orgPositions:update', { ...current, ...pos });
    }
  };

  const deleteOrgPosition = (id: string) => {
    socket.emit('orgPositions:delete', id);
  };

  const addDocument = (doc: Omit<Document, 'id' | 'createdAt'>) => {
    const newItem = { ...doc, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('documents:add', newItem);
  };

  const updateDocument = (id: string, doc: Partial<Document>) => {
    const current = state.documents.find(d => d.id === id);
    if (current) {
      socket.emit('documents:update', { ...current, ...doc });
    }
  };

  const deleteDocument = (id: string) => {
    socket.emit('documents:delete', id);
  };

  const addUnitFile = (file: Omit<UnitFile, 'id' | 'createdAt'>) => {
    const newItem = { ...file, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('unitFiles:add', newItem);
  };

  const updateUnitFile = (id: string, file: Partial<UnitFile>) => {
    const current = state.unitFiles.find(f => f.id === id);
    if (current) {
      socket.emit('unitFiles:update', { ...current, ...file });
    }
  };

  const deleteUnitFile = (id: string) => {
    socket.emit('unitFiles:delete', id);
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newItem = { ...ann, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('announcements:add', newItem);
  };

  const updateAnnouncement = (id: string, ann: Partial<Announcement>) => {
    const current = state.announcements.find(a => a.id === id);
    if (current) {
      socket.emit('announcements:update', { ...current, ...ann });
    }
  };

  const deleteAnnouncement = (id: string) => {
    socket.emit('announcements:delete', id);
  };

  const addStudentForm = (form: Omit<StudentForm, 'id' | 'createdAt'>) => {
    const newItem = { ...form, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('studentForms:add', newItem);
  };

  const updateStudentForm = (id: string, form: Partial<StudentForm>) => {
    const current = state.studentForms.find(f => f.id === id);
    if (current) {
      socket.emit('studentForms:update', { ...current, ...form });
    }
  };

  const deleteStudentForm = (id: string) => {
    socket.emit('studentForms:delete', id);
  };

  const addSubmission = (sub: Omit<FormSubmission, 'id' | 'createdAt'>) => {
    const newItem = { ...sub, id: generateId(), createdAt: new Date().toISOString() };
    socket.emit('submissions:add', newItem);
  };

  const updateSubmission = (id: string, sub: Partial<FormSubmission>) => {
    const current = state.submissions.find(s => s.id === id);
    if (current) {
      socket.emit('submissions:update', { ...current, ...sub });
    }
  };

  const deleteSubmission = (id: string) => {
    socket.emit('submissions:delete', id);
  };

  const updateSettings = (settings: Partial<Settings>) => {
    socket.emit('settings:update', { ...state.settings, ...settings });
  };

  return (
    <StoreContext.Provider value={{
      ...state,
      isConnected,
      user,
      login,
      logout,
      addActivity, updateActivity, deleteActivity,
      addReport, updateReport, deleteReport,
      addOrgPosition, updateOrgPosition, deleteOrgPosition,
      addDocument, updateDocument, deleteDocument,
      addUnitFile, updateUnitFile, deleteUnitFile,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      addStudentForm, updateStudentForm, deleteStudentForm,
      addSubmission, updateSubmission, deleteSubmission,
      updateSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
