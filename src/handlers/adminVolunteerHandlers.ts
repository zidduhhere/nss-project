import { VolunteerProfile } from '@/types/VolunteerProfile';
import { exportVolunteersToCSV, exportVolunteersWithStats } from '@/utils/exportUtils';

export class AdminVolunteerHandlers {
  private setSelectedVolunteer: (volunteer: VolunteerProfile | null) => void;
  private setIsOverlayOpen: (isOpen: boolean) => void;
  private setIsRefreshing: (isRefreshing: boolean) => void;
  private setSearchQuery: (query: string) => void;
  private setStatusFilter: (status: string) => void;
  private setUnitFilter: (unit: string) => void;
  private setCourseFilter: (course: string) => void;
  private setSemesterFilter: (semester: string) => void;
  private setBloodGroupFilter: (bloodGroup: string) => void;
  private setActiveFilter: (status: 'all' | 'active' | 'inactive') => void;
  private refetch: () => Promise<void>;
  private clearFilters: () => void;

  constructor(
    setters: {
      setSelectedVolunteer: (volunteer: VolunteerProfile | null) => void;
      setIsOverlayOpen: (isOpen: boolean) => void;
      setIsRefreshing: (isRefreshing: boolean) => void;
      setSearchQuery: (query: string) => void;
      setStatusFilter: (status: string) => void;
      setUnitFilter: (unit: string) => void;
      setCourseFilter: (course: string) => void;
      setSemesterFilter: (semester: string) => void;
      setBloodGroupFilter: (bloodGroup: string) => void;
      setActiveFilter: (status: 'all' | 'active' | 'inactive') => void;
    },
    actions: {
      refetch: () => Promise<void>;
      clearFilters: () => void;
    }
  ) {
    this.setSelectedVolunteer = setters.setSelectedVolunteer;
    this.setIsOverlayOpen = setters.setIsOverlayOpen;
    this.setIsRefreshing = setters.setIsRefreshing;
    this.setSearchQuery = setters.setSearchQuery;
    this.setStatusFilter = setters.setStatusFilter;
    this.setUnitFilter = setters.setUnitFilter;
    this.setCourseFilter = setters.setCourseFilter;
    this.setSemesterFilter = setters.setSemesterFilter;
    this.setBloodGroupFilter = setters.setBloodGroupFilter;
    this.setActiveFilter = setters.setActiveFilter;
    this.refetch = actions.refetch;
    this.clearFilters = actions.clearFilters;
  }

  handleViewVolunteer = (volunteer: VolunteerProfile) => {
    this.setSelectedVolunteer(volunteer);
    this.setIsOverlayOpen(true);
  };

  handleCloseOverlay = () => {
    this.setIsOverlayOpen(false);
    this.setSelectedVolunteer(null);
  };

  handleRefresh = async () => {
    this.setIsRefreshing(true);
    try {
      await this.refetch();
    } finally {
      this.setIsRefreshing(false);
    }
  };

  handleResetFilters = () => {
    this.setSearchQuery('');
    this.setStatusFilter('all');
    this.setUnitFilter('all');
    this.setCourseFilter('all');
    this.setSemesterFilter('');
    this.setBloodGroupFilter('all');
    this.setActiveFilter('all');
    this.clearFilters();
  };

  handleExport = (volunteers: VolunteerProfile[]) => {
    exportVolunteersToCSV(volunteers);
  };

  handleExportWithStats = (volunteers: VolunteerProfile[]) => {
    exportVolunteersWithStats(volunteers, true);
  };
}
