import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState, Activity, Report, OrgPosition, Document, UnitFile, Settings } from './types';
import { io } from 'socket.io-client';

const socket = io();

const defaultSettings: Settings = {
  departmentName: 'Jabatan Hal Kebajikan Pelajar (JHEP)',
  institutionName: 'Kolej Vokasional Beaufort',
};

const initialState: AppState = {
  activities: [],
  reports: [],
  orgPositions: [],
  documents: [],
  unitFiles: [],
  settings: defaultSettings,
};

interface StoreContextType extends AppState {
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

  updateSettings: (settings: Partial<Settings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    // Initial state from server
    socket.on('state:init', (serverState: AppState) => {
      isRemoteUpdate.current = true;
      setState(serverState);
    });

    // Real-time updates from other users
    socket.on('state:changed', (newState: AppState) => {
      isRemoteUpdate.current = true;
      setState(newState);
    });

    return () => {
      socket.off('state:init');
      socket.off('state:changed');
    };
  }, []);

  useEffect(() => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    // Sync local changes to server
    socket.emit('state:update', state);
  }, [state]);

  const generateId = () => crypto.randomUUID();

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    setState(s => ({
      ...s,
      activities: [...s.activities, { ...activity, id: generateId(), createdAt: new Date().toISOString() }]
    }));
  };

  const updateActivity = (id: string, activity: Partial<Activity>) => {
    setState(s => ({
      ...s,
      activities: s.activities.map(a => a.id === id ? { ...a, ...activity } : a)
    }));
  };

  const deleteActivity = (id: string) => {
    setState(s => ({ ...s, activities: s.activities.filter(a => a.id !== id) }));
  };

  const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    setState(s => ({
      ...s,
      reports: [...s.reports, { ...report, id: generateId(), createdAt: new Date().toISOString() }]
    }));
  };

  const updateReport = (id: string, report: Partial<Report>) => {
    setState(s => ({
      ...s,
      reports: s.reports.map(r => r.id === id ? { ...r, ...report } : r)
    }));
  };

  const deleteReport = (id: string) => {
    setState(s => ({ ...s, reports: s.reports.filter(r => r.id !== id) }));
  };

  const addOrgPosition = (pos: Omit<OrgPosition, 'id' | 'createdAt'>) => {
    setState(s => ({
      ...s,
      orgPositions: [...s.orgPositions, { ...pos, id: generateId(), createdAt: new Date().toISOString() }]
    }));
  };

  const updateOrgPosition = (id: string, pos: Partial<OrgPosition>) => {
    setState(s => ({
      ...s,
      orgPositions: s.orgPositions.map(o => o.id === id ? { ...o, ...pos } : o)
    }));
  };

  const deleteOrgPosition = (id: string) => {
    setState(s => ({ ...s, orgPositions: s.orgPositions.filter(o => o.id !== id) }));
  };

  const addDocument = (doc: Omit<Document, 'id' | 'createdAt'>) => {
    setState(s => ({
      ...s,
      documents: [...s.documents, { ...doc, id: generateId(), createdAt: new Date().toISOString() }]
    }));
  };

  const updateDocument = (id: string, doc: Partial<Document>) => {
    setState(s => ({
      ...s,
      documents: s.documents.map(d => d.id === id ? { ...d, ...doc } : d)
    }));
  };

  const deleteDocument = (id: string) => {
    setState(s => ({ ...s, documents: s.documents.filter(d => d.id !== id) }));
  };

  const addUnitFile = (file: Omit<UnitFile, 'id' | 'createdAt'>) => {
    setState(s => ({
      ...s,
      unitFiles: [...s.unitFiles, { ...file, id: generateId(), createdAt: new Date().toISOString() }]
    }));
  };

  const updateUnitFile = (id: string, file: Partial<UnitFile>) => {
    setState(s => ({
      ...s,
      unitFiles: s.unitFiles.map(f => f.id === id ? { ...f, ...file } : f)
    }));
  };

  const deleteUnitFile = (id: string) => {
    setState(s => ({ ...s, unitFiles: s.unitFiles.filter(f => f.id !== id) }));
  };

  const updateSettings = (settings: Partial<Settings>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...settings } }));
  };

  return (
    <StoreContext.Provider value={{
      ...state,
      addActivity, updateActivity, deleteActivity,
      addReport, updateReport, deleteReport,
      addOrgPosition, updateOrgPosition, deleteOrgPosition,
      addDocument, updateDocument, deleteDocument,
      addUnitFile, updateUnitFile, deleteUnitFile,
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
