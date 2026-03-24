/**
 * Unit Volunteer Service
 *
 * Thin wrapper around the consolidated volunteerService.
 * Kept for backward-compatibility with existing imports in unit dashboard hooks/views.
 */
import { volunteerService, VolunteerFilters, VolunteerUpdateData } from "@/services/volunteerService";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { PaginationParams } from "@/services/pagination";

export type { VolunteerFilters, VolunteerUpdateData };

export const unitVolunteerService = {
  getAllVolunteers: (filters?: VolunteerFilters, pagination?: PaginationParams) =>
    volunteerService.getAllVolunteers(filters, pagination),

  getVolunteersByUnit: (unitId: string, pagination?: PaginationParams) =>
    volunteerService.getVolunteersByUnit(unitId, pagination),

  getVolunteersByStatus: (status: string, pagination?: PaginationParams) =>
    volunteerService.getAllVolunteers({ status }, pagination),

  getVolunteerById: (volunteerId: string): Promise<VolunteerProfile> =>
    volunteerService.getVolunteerById(volunteerId),

  updateVolunteerStatus: (
    volunteerId: string,
    status: "pending" | "approved" | "rejected" | "certified"
  ) => volunteerService.updateVolunteerStatus(volunteerId, status),

  updateVolunteer: (volunteerId: string, updates: VolunteerUpdateData) =>
    volunteerService.updateVolunteer(volunteerId, updates),

  bulkApproveVolunteers: (volunteerIds: string[]) =>
    volunteerService.bulkUpdateStatus(volunteerIds, "approved"),

  bulkRejectVolunteers: (volunteerIds: string[]) =>
    volunteerService.bulkUpdateStatus(volunteerIds, "rejected"),

  deleteVolunteer: (volunteerId: string) =>
    volunteerService.deleteVolunteer(volunteerId),

  getVolunteerStats: (unitId?: string) =>
    volunteerService.getVolunteerStats(unitId),

  searchVolunteers: (searchQuery: string, unitId?: string, pagination?: PaginationParams) =>
    volunteerService.searchVolunteers(searchQuery, unitId, pagination),
};
