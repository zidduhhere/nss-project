import { UserWithDetails } from '@/types/UserWithDetails';

export class AdminUsersHandlers {
  private setSelectedUser: (user: UserWithDetails | null) => void;
  private setIsDetailsOpen: (isOpen: boolean) => void;
  private setIsRefreshing: (isRefreshing: boolean) => void;
  private setSearchQuery: (query: string) => void;
  private setRoleFilter: (role: 'all' | 'student' | 'unit') => void;
  private setDistrictFilter: (district: string) => void;
  private refetch: () => Promise<void>;
  private clearFilters: () => void;

  constructor(
    setters: {
      setSelectedUser: (user: UserWithDetails | null) => void;
      setIsDetailsOpen: (isOpen: boolean) => void;
      setIsRefreshing: (isRefreshing: boolean) => void;
      setSearchQuery: (query: string) => void;
      setRoleFilter: (role: 'all' | 'student' | 'unit') => void;
      setDistrictFilter: (district: string) => void;
    },
    actions: {
      refetch: () => Promise<void>;
      clearFilters: () => void;
    }
  ) {
    this.setSelectedUser = setters.setSelectedUser;
    this.setIsDetailsOpen = setters.setIsDetailsOpen;
    this.setIsRefreshing = setters.setIsRefreshing;
    this.setSearchQuery = setters.setSearchQuery;
    this.setRoleFilter = setters.setRoleFilter;
    this.setDistrictFilter = setters.setDistrictFilter;
    this.refetch = actions.refetch;
    this.clearFilters = actions.clearFilters;
  }

  handleViewUser = (user: UserWithDetails) => {
    this.setSelectedUser(user);
    this.setIsDetailsOpen(true);
  };

  handleCloseDetails = () => {
    this.setIsDetailsOpen(false);
    this.setSelectedUser(null);
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
    this.setRoleFilter('all');
    this.setDistrictFilter('all');
    this.clearFilters();
  };

  handleExportUsers = (users: UserWithDetails[]) => {
    const headers = ['Email', 'Name', 'Role', 'Phone', 'Unit Number', 'College', 'District', 'Applications', 'Created At'];
    
    const rows = users.map(user => [
      user.email,
      user.full_name || 'N/A',
      user.role,
      user.phone_number || 'N/A',
      user.unit_number || 'N/A',
      user.college_name || 'N/A',
      user.district || 'N/A',
      user.volunteer_applications?.toString() || '0',
      new Date(user.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}
