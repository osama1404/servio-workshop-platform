import { workshopDb } from '../db/store';
import { JobCard, JobCardStatus, JobCardLineItem } from '../models/types';
import { BayScheduler } from './bayScheduler';

export class JobCardStateMachine {
  private static readonly VALID_TRANSITIONS: Record<JobCardStatus, JobCardStatus[]> = {
    DRAFT: ['INSPECTION'],
    INSPECTION: ['ESTIMATE_APPROVED', 'COMPLETED'],
    ESTIMATE_APPROVED: ['IN_PROGRESS'],
    IN_PROGRESS: ['QA_TESTING'],
    QA_TESTING: ['COMPLETED', 'IN_PROGRESS'],
    COMPLETED: ['INVOICED'],
    INVOICED: [],
  };

  /**
   * Enforces rigorous state transitions across the digital vehicle repair lifecycle.
   */
  public static transitionStatus(jobCardId: string, nextStatus: JobCardStatus): JobCard {
    const jobCard = workshopDb.jobCards.find((j) => j.id === jobCardId);
    if (!jobCard) {
      throw new Error(`Job Card '${jobCardId}' not found.`);
    }

    const allowed = this.VALID_TRANSITIONS[jobCard.status];
    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Invalid lifecycle transition: Cannot advance Job Card from '${jobCard.status}' to '${nextStatus}'. Permitted next states: [${allowed.join(
          ', '
        )}]`
      );
    }

    jobCard.status = nextStatus;
    jobCard.updatedAt = new Date().toISOString();

    // Side effects upon completion: Release bay and append to vehicle service history
    if (nextStatus === 'COMPLETED') {
      if (jobCard.assignedBayId) {
        BayScheduler.releaseBay(jobCard.assignedBayId);
      }

      const vehicle = workshopDb.vehicles.find((v) => v.id === jobCard.vehicleId);
      if (vehicle) {
        vehicle.serviceHistory.push({
          id: `rec-${Date.now()}`,
          jobCardId: jobCard.id,
          serviceDate: new Date().toISOString().split('T')[0],
          mileage: jobCard.odometerIn,
          summary: `Service completed: ${jobCard.items.map((i) => i.description).join(', ')}`,
          cost: jobCard.grandTotal,
        });
      }
    }

    return jobCard;
  }

  /**
   * Dynamically adds a billable part or labor line item and recalculates financial totals.
   */
  public static addLineItem(
    jobCardId: string,
    item: Omit<JobCardLineItem, 'id' | 'total'>
  ): JobCard {
    const jobCard = workshopDb.jobCards.find((j) => j.id === jobCardId);
    if (!jobCard) {
      throw new Error(`Job Card '${jobCardId}' not found.`);
    }

    const total = Number((item.quantity * item.unitPrice).toFixed(2));
    const newItem: JobCardLineItem = {
      id: `item-${Date.now()}`,
      description: item.description,
      type: item.type,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total,
    };

    jobCard.items.push(newItem);
    this.recalculateTotals(jobCard);

    return jobCard;
  }

  private static recalculateTotals(jobCard: JobCard) {
    const subtotal = jobCard.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = Number((subtotal * 0.05).toFixed(2)); // UAE 5% VAT
    const grandTotal = Number((subtotal + taxAmount).toFixed(2));

    jobCard.subtotal = subtotal;
    jobCard.taxAmount = taxAmount;
    jobCard.grandTotal = grandTotal;
    jobCard.updatedAt = new Date().toISOString();
  }
}
