export interface InvoiceItem {
  id: string;
  description: string;
  notes?: string;
  qty: number;
  price: number;
}

export interface TaxSetting {
  id: string;
  name: string;
  rate: number;
  enabled: boolean;
}

export interface InvoiceData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  
  // Client Info
  clientName: string;
  clientAddress: string;
  
  // Items
  items: InvoiceItem[];
  
  // Financials
  // Replaced single tax fields with array of settings
  taxSettings: TaxSetting[];
  
  paymentMethod: string;
  accountNumber?: string;
  accountName?: string; // Added account name (Atas Nama)
  amountPaid: number;
  
  // Styling & Extras
  primaryColor: string;
  signatureImage: string | null;
  stampImage: string | null;
  
  // Signer Info
  signerName?: string;
  signerTitle?: string;
  
  // Watermark
  watermarkImage: string | null;
  watermarkOpacity: number; // 0 - 100
  watermarkScale: number; // 0 - 100 (percentage relative to page width)
  watermarkX: number; // -100 to 100 (Horizontal Position)
  watermarkY: number; // -100 to 100 (Vertical Position)
}