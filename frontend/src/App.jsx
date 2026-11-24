import React, { useState } from 'react';

const initialBays = [
  { id: 'bay-01', code: 'BAY-LIFT-1', name: 'Hydraulic Lift 1', type: 'Two-Post Lift', status: 'OCCUPIED', currentJobCardId: 'JC-2026-001' },
  { id: 'bay-02', code: 'BAY-LIFT-2', name: 'Hydraulic Lift 2', type: 'Two-Post Lift', status: 'AVAILABLE', currentJobCardId: null },
  { id: 'bay-03', code: 'BAY-ALIGN-1', name: 'Laser Alignment Bay', type: 'Four-Post Lift', status: 'AVAILABLE', currentJobCardId: null },
  { id: 'bay-04', code: 'BAY-DIAG-1', name: 'ECU Diagnostic Bay', type: 'Diagnostic Bay', status: 'MAINTENANCE', currentJobCardId: null },
];

const initialJobCards = [
  {
    id: 'jc-2026-001',
    jobNumber: 'JC-2026-001',
    vehicle: 'Toyota Land Cruiser VXR (Dubai A-59124)',
    customer: 'Omar Khalid Al-Suwaidi',
    status: 'IN_PROGRESS',
    bay: 'Hydraulic Lift 1',
    technician: 'Suresh Kumar',
    total: 771.75,
  },
  {
    id: 'jc-2026-002',
    jobNumber: 'JC-2026-002',
    vehicle: 'Nissan Patrol Titanium (Abu Dhabi 12-48291)',
    customer: 'Rashid Mansoor',
    status: 'INSPECTION',
    bay: 'Unassigned',
    technician: 'Ahmed Farooq',
    total: 450.00,
  },
];

export default function App() {
  const [bays] = useState(initialBays);
  const [jobCards, setJobCards] = useState(initialJobCards);
  const [selectedJob, setSelectedJob] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return '#22c55e';
      case 'OCCUPIED': return '#ef4444';
      case 'MAINTENANCE': return '#eab308';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'INSPECTION': return '#8b5cf6';
      case 'COMPLETED': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '32px 48px', backgroundColor: '#0b1120' }}>
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid #1e293b', paddingBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>
            Servio Workshop Operations Platform
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: 14 }}>
            Facility Hub: Al Quoz Industrial Area 1, Dubai • Real-time Bay Dispatch & Job Card Telematics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ padding: '6px 14px', background: '#1e293b', borderRadius: 6, fontSize: 13, color: '#38bdf8' }}>
            ● API Connected (Port 5000)
          </span>
        </div>
      </header>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <div style={{ background: '#1e293b', padding: 20, borderRadius: 8, border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: 13, textTransform: 'uppercase' }}>Total Workshop Bays</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: '#f8fafc' }}>4 Units</div>
        </div>
        <div style={{ background: '#1e293b', padding: 20, borderRadius: 8, border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: 13, textTransform: 'uppercase' }}>Active Bays (Occupied)</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: '#ef4444' }}>1 Bay</div>
        </div>
        <div style={{ background: '#1e293b', padding: 20, borderRadius: 8, border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: 13, textTransform: 'uppercase' }}>Available Capacity</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: '#22c55e' }}>2 Bays</div>
        </div>
        <div style={{ background: '#1e293b', padding: 20, borderRadius: 8, border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: 13, textTransform: 'uppercase' }}>Active Job Cards</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: '#38bdf8' }}>2 Vehicles</div>
        </div>
      </div>

      {/* Service Bay Dispatch Grid */}
      <h2 style={{ fontSize: 18, marginBottom: 16, color: '#f1f5f9' }}>Hydraulic & Service Bay Dispatch Board</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {bays.map((bay) => (
          <div key={bay.id} style={{
            background: '#1e293b',
            borderRadius: 8,
            padding: 20,
            borderLeft: `5px solid ${getStatusColor(bay.status)}`,
            borderTop: '1px solid #334155',
            borderRight: '1px solid #334155',
            borderBottom: '1px solid #334155',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{bay.code}</span>
              <span style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 4,
                backgroundColor: `${getStatusColor(bay.status)}22`,
                color: getStatusColor(bay.status),
                fontWeight: 600
              }}>
                {bay.status}
              </span>
            </div>
            <h3 style={{ margin: '12px 0 6px 0', fontSize: 16, color: '#f8fafc' }}>{bay.name}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Type: {bay.type}</p>
            <div style={{ marginTop: 14, fontSize: 12, color: bay.currentJobCardId ? '#38bdf8' : '#64748b' }}>
              {bay.currentJobCardId ? `Assigned: ${bay.currentJobCardId}` : 'Ready for assignment'}
            </div>
          </div>
        ))}
      </div>

      {/* Active Digital Job Cards Table */}
      <h2 style={{ fontSize: 18, marginBottom: 16, color: '#f1f5f9' }}>Live Digital Job Cards (State Machine)</h2>
      <div style={{ background: '#1e293b', borderRadius: 8, border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '14px 18px' }}>Job #</th>
              <th style={{ padding: '14px 18px' }}>Vehicle Details</th>
              <th style={{ padding: '14px 18px' }}>Customer</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Assigned Bay</th>
              <th style={{ padding: '14px 18px' }}>Technician</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total (AED)</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.map((job) => (
              <tr key={job.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#38bdf8' }}>{job.jobNumber}</td>
                <td style={{ padding: '14px 18px', color: '#f8fafc' }}>{job.vehicle}</td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{job.customer}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    borderRadius: 4,
                    backgroundColor: `${getStatusColor(job.status)}22`,
                    color: getStatusColor(job.status),
                    fontWeight: 600
                  }}>
                    {job.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{job.bay}</td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{job.technician}</td>
                <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: '#f8fafc' }}>
                  AED {job.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
