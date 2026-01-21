import { InvoiceData, SavedInvoice } from '../types';

const STORAGE_KEY = 'INVOICE_GENERATOR_DATA_V1';
const HISTORY_KEY = 'INVOICE_GENERATOR_HISTORY_V1';

// --- Current Draft Storage (Auto-save) ---

export const saveToLocalStorage = (data: InvoiceData): boolean => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Gagal menyimpan ke Local Storage (mungkin kuota penuh karena gambar):', error);
    return false;
  }
};

export const loadFromLocalStorage = (): InvoiceData | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return null;
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Gagal memuat dari Local Storage:', error);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Gagal menghapus Local Storage:', error);
  }
};

// --- History Storage (Snapshots) ---

export const getHistory = (): SavedInvoice[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const saveToHistory = (data: InvoiceData, title: string): SavedInvoice[] => {
  const history = getHistory();
  const newItem: SavedInvoice = {
    id: Date.now().toString(),
    title: title || 'Tanpa Nama',
    timestamp: Date.now(),
    data: data
  };
  // Add new item to the beginning
  const newHistory = [newItem, ...history];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Error saving history (likely quota exceeded):', error);
    return history;
  }
};

export const deleteFromHistory = (id: string): SavedInvoice[] => {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
};