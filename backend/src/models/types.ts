export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

export interface ServiceRecord {
  id: string;
  jobCardId: string;
  serviceDate: string;
  mileage: number;
  summary: string;
  cost: number;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  currentMileage: number;
  serviceHistory: ServiceRecord[];
}

export interface Workshop {
  id: string;
  name: string;
  city: string;
  tradeLicense: string;
  operatingHours: string;
  totalBays: number;
}

export type BayType = 'TWO_POST_LIFT' | 'FOUR_POST_ALIGNMENT' | 'QUICK_LUBE' | 'DIAGNOSTIC_BAY';
export type BayStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface Bay {
  id: string;
  workshopId: string;
  code: string;
  name: string;
  bayType: BayType;
  status: BayStatus;
  currentJobCardId?: string;
  occupiedSince?: string;
}

export type JobCardStatus =
  | 'DRAFT'
  | 'INSPECTION'
  | 'ESTIMATE_APPROVED'
  | 'IN_PROGRESS'
  | 'QA_TESTING'
  | 'COMPLETED'
  | 'INVOICED';

export interface JobCardLineItem {
  id: string;
  description: string;
  type: 'LABOR' | 'PART';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface JobCard {
  id: string;
  jobNumber: string;
  workshopId: string;
  vehicleId: string;
  customerId: string;
  assignedBayId?: string;
  technicianName: string;
  odometerIn: number;
  odometerOut?: number;
  reportedFaults: string[];
  status: JobCardStatus;
  items: JobCardLineItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}
