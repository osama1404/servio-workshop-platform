import { Router, Request, Response } from 'express';
import { workshopDb } from '../db/store';
import { BayScheduler } from '../services/bayScheduler';
import { JobCardStateMachine } from '../services/jobCardStateMachine';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'servio-workshop-platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Bay board metrics
apiRouter.get('/workshops/:id/bays', (req: Request, res: Response) => {
  try {
    const metrics = BayScheduler.getBayMetrics(req.params.id);
    res.json({ success: true, ...metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign bay to job card
apiRouter.post('/bays/assign', (req: Request, res: Response) => {
  try {
    const { bayId, jobCardId } = req.body;
    if (!bayId || !jobCardId) {
      return res.status(400).json({ success: false, error: 'Missing bayId or jobCardId' });
    }
    const bay = BayScheduler.assignBay(bayId, jobCardId);
    return res.json({ success: true, bay });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Release bay
apiRouter.post('/bays/release', (req: Request, res: Response) => {
  try {
    const { bayId } = req.body;
    if (!bayId) {
      return res.status(400).json({ success: false, error: 'Missing bayId' });
    }
    const bay = BayScheduler.releaseBay(bayId);
    return res.json({ success: true, bay });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Job cards listing
apiRouter.get('/job-cards', (_req: Request, res: Response) => {
  res.json({ success: true, total: workshopDb.jobCards.length, jobCards: workshopDb.jobCards });
});

// Job card by ID
apiRouter.get('/job-cards/:id', (req: Request, res: Response) => {
  const card = workshopDb.jobCards.find((j) => j.id === req.params.id);
  if (!card) return res.status(404).json({ success: false, error: 'Job card not found.' });
  return res.json({ success: true, jobCard: card });
});

// Advance job card status
apiRouter.post('/job-cards/:id/transition', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Target status is required.' });
    }
    const updated = JobCardStateMachine.transitionStatus(req.params.id, status);
    return res.json({ success: true, jobCard: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Add parts or labor
apiRouter.post('/job-cards/:id/items', (req: Request, res: Response) => {
  try {
    const { description, type, quantity, unitPrice } = req.body;
    if (!description || !type || !quantity || !unitPrice) {
      return res.status(400).json({ success: false, error: 'Missing line item details.' });
    }
    const updated = JobCardStateMachine.addLineItem(req.params.id, {
      description,
      type,
      quantity,
      unitPrice,
    });
    return res.json({ success: true, jobCard: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// Vehicle service history lookup
apiRouter.get('/vehicles/:id/history', (req: Request, res: Response) => {
  const vehicle = workshopDb.vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found.' });
  return res.json({
    success: true,
    vehicle: {
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
      currentMileage: vehicle.currentMileage,
    },
    serviceHistory: vehicle.serviceHistory,
  });
});
