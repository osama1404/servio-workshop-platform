import { Customer, Vehicle, Workshop, Bay, JobCard } from '../models/types';

export class WorkshopStore {
  public customers: Customer[] = [];
  public vehicles: Vehicle[] = [];
  public workshops: Workshop[] = [];
  public bays: Bay[] = [];
  public jobCards: JobCard[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    this.workshops = [
      {
        id: 'ws-alquoz-01',
        name: 'Servio Premier Auto Service - Dubai',
        city: 'Dubai',
        tradeLicense: 'DXB-AUT-99281',
        operatingHours: '08:00 - 19:00',
        totalBays: 4,
      },
    ];

    this.bays = [
      {
        id: 'bay-01',
        workshopId: 'ws-alquoz-01',
        code: 'BAY-LIFT-1',
        name: 'Hydraulic Lift 1 (General Mechanical)',
        bayType: 'TWO_POST_LIFT',
        status: 'OCCUPIED',
        currentJobCardId: 'jc-2026-001',
        occupiedSince: '2026-11-24T08:30:00Z',
      },
      {
        id: 'bay-02',
        workshopId: 'ws-alquoz-01',
        code: 'BAY-LIFT-2',
        name: 'Hydraulic Lift 2 (Suspension & Brakes)',
        bayType: 'TWO_POST_LIFT',
        status: 'AVAILABLE',
      },
      {
        id: 'bay-03',
        workshopId: 'ws-alquoz-01',
        code: 'BAY-ALIGN-1',
        name: 'Laser Wheel Alignment 3',
        bayType: 'FOUR_POST_ALIGNMENT',
        status: 'AVAILABLE',
      },
      {
        id: 'bay-04',
        workshopId: 'ws-alquoz-01',
        code: 'BAY-DIAG-1',
        name: 'Advanced ECU Diagnostic Bay',
        bayType: 'DIAGNOSTIC_BAY',
        status: 'MAINTENANCE',
      },
    ];

    this.customers = [
      {
        id: 'cust-omar-khalid',
        fullName: 'Omar Khalid Al-Suwaidi',
        email: 'omar.khalid@example.ae',
        phone: '+971-50-1234567',
        city: 'Dubai',
        createdAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'cust-rashid-mansoor',
        fullName: 'Rashid Mansoor Al-Nuaimi',
        email: 'rashid.mansoor@example.ae',
        phone: '+971-55-9876543',
        city: 'Abu Dhabi',
        createdAt: '2026-03-20T11:30:00Z',
      },
    ];

    this.vehicles = [
      {
        id: 'veh-land-cruiser-01',
        ownerId: 'cust-omar-khalid',
        vin: 'JTMHU01J904192841',
        make: 'Toyota',
        model: 'Land Cruiser VXR 3.5L Twin Turbo',
        year: 2024,
        plateNumber: 'Dubai A-59124',
        currentMileage: 42150,
        serviceHistory: [
          {
            id: 'rec-001',
            jobCardId: 'jc-hist-101',
            serviceDate: '2026-05-10',
            mileage: 30000,
            summary: '30,000 KM Major Service + Brake Pad Replacement',
            cost: 2150.0,
          },
        ],
      },
      {
        id: 'veh-patrol-02',
        ownerId: 'cust-rashid-mansoor',
        vin: 'JN8AY2NC7E9182746',
        make: 'Nissan',
        model: 'Patrol Titanium 5.6L V8',
        year: 2023,
        plateNumber: 'Abu Dhabi 12-48291',
        currentMileage: 68400,
        serviceHistory: [],
      },
    ];

    this.jobCards = [
      {
        id: 'jc-2026-001',
        jobNumber: 'JC-2026-001',
        workshopId: 'ws-alquoz-01',
        vehicleId: 'veh-land-cruiser-01',
        customerId: 'cust-omar-khalid',
        assignedBayId: 'bay-01',
        technicianName: 'Suresh Kumar (Senior Specialist)',
        odometerIn: 42150,
        reportedFaults: ['Scheduled 40K service', 'Slight steering vibration at 110 km/h'],
        status: 'IN_PROGRESS',
        items: [
          {
            id: 'item-1',
            description: 'Fully Synthetic 5W-30 Motor Oil (8L)',
            type: 'PART',
            quantity: 8,
            unitPrice: 45.0,
            total: 360.0,
          },
          {
            id: 'item-2',
            description: 'OEM Oil Filter Replacement',
            type: 'PART',
            quantity: 1,
            unitPrice: 75.0,
            total: 75.0,
          },
          {
            id: 'item-3',
            description: 'Standard Periodic Service Labor Inspection',
            type: 'LABOR',
            quantity: 2,
            unitPrice: 150.0,
            total: 300.0,
          },
        ],
        subtotal: 735.0,
        taxAmount: 36.75,
        grandTotal: 771.75,
        createdAt: '2026-11-24T08:30:00Z',
        updatedAt: '2026-11-24T09:15:00Z',
      },
    ];
  }
}

export const workshopDb = new WorkshopStore();
