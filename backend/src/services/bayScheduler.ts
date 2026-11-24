import { workshopDb } from '../db/store';
import { Bay } from '../models/types';

export class BayScheduler {
  /**
   * Assigns an available workshop bay to a job card with atomic conflict prevention.
   */
  public static assignBay(bayId: string, jobCardId: string): Bay {
    const bay = workshopDb.bays.find((b) => b.id === bayId);
    if (!bay) {
      throw new Error(`Bay '${bayId}' not found.`);
    }

    if (bay.status === 'OCCUPIED' && bay.currentJobCardId !== jobCardId) {
      throw new Error(`Conflict: Bay '${bay.name}' (${bay.code}) is currently occupied by Job Card #${bay.currentJobCardId}`);
    }

    if (bay.status === 'MAINTENANCE') {
      throw new Error(`Bay '${bay.name}' is currently offline for routine calibration/maintenance.`);
    }

    // Free up any previous bay assigned to this job card
    for (const b of workshopDb.bays) {
      if (b.currentJobCardId === jobCardId && b.id !== bayId) {
        b.status = 'AVAILABLE';
        b.currentJobCardId = undefined;
        b.occupiedSince = undefined;
      }
    }

    bay.status = 'OCCUPIED';
    bay.currentJobCardId = jobCardId;
    bay.occupiedSince = new Date().toISOString();

    return bay;
  }

  /**
   * Releases a bay back to AVAILABLE status once a vehicle exits service.
   */
  public static releaseBay(bayId: string): Bay {
    const bay = workshopDb.bays.find((b) => b.id === bayId);
    if (!bay) {
      throw new Error(`Bay '${bayId}' not found.`);
    }

    bay.status = 'AVAILABLE';
    bay.currentJobCardId = undefined;
    bay.occupiedSince = undefined;

    return bay;
  }

  /**
   * Returns live overview of all workshop service bays.
   */
  public static getBayMetrics(workshopId: string) {
    const bays = workshopDb.bays.filter((b) => b.workshopId === workshopId);
    const total = bays.length;
    const occupied = bays.filter((b) => b.status === 'OCCUPIED').length;
    const available = bays.filter((b) => b.status === 'AVAILABLE').length;
    const maintenance = bays.filter((b) => b.status === 'MAINTENANCE').length;
    const occupancyRate = total > 0 ? Number(((occupied / total) * 100).toFixed(1)) : 0;

    return { total, occupied, available, maintenance, occupancyRate, bays };
  }
}
