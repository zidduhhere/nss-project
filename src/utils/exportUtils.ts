import { VolunteerProfile } from "@/types/VolunteerProfile";

/**
 * Export Utilities
 * 
 * Provides functions for exporting data to various formats (CSV, Excel, etc.)
 */

/**
 * Convert array of objects to CSV format
 * @param headers - Array of column headers
 * @param rows - Array of rows (each row is an array of cell values)
 * @returns CSV string
 */
export const arrayToCSV = (headers: string[], rows: (string | number | null | undefined)[][]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = rows.map((row) => 
    row.map((cell) => {
      // Handle null/undefined
      const value = cell ?? 'N/A';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Download content as a file
 * @param content - File content
 * @param filename - Name of the file to download
 * @param mimeType - MIME type of the file
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/csv'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Export volunteers data to CSV
 * @param volunteers - Array of volunteer profiles
 * @param filename - Optional custom filename
 */
export const exportVolunteersToCSV = (
  volunteers: VolunteerProfile[], 
  filename?: string
): void => {
  const headers = [
    'Name',
    'KTU ID',
    'Phone',
    'Course',
    'Semester',
    'Unit',
    'Blood Group',
    'Status',
    'Date of Birth',
    'Gender',
    'Address',
    'Created At'
  ];

  const rows = volunteers.map((v) => [
    v.full_name,
    v.ktu_id,
    v.contact_number,
    v.course,
    v.semester,
    v.unit_id,
    v.blood_group,
    v.status,
    v.dob,
    v.gender,
    v.permanent_address,
    v.created_at ? new Date(v.created_at).toLocaleDateString() : null,
  ]);

  const csvContent = arrayToCSV(headers, rows);
  const defaultFilename = `volunteers-${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadFile(csvContent, filename || defaultFilename, 'text/csv');
};

/**
 * Export filtered volunteers with custom fields
 * @param volunteers - Array of volunteer profiles
 * @param fields - Object mapping display names to field accessors
 * @param filename - Optional custom filename
 */
export const exportVolunteersCustom = (
  volunteers: VolunteerProfile[],
  fields: Record<string, (v: VolunteerProfile) => string | number | null | undefined>,
  filename?: string
): void => {
  const headers = Object.keys(fields);
  const rows = volunteers.map((volunteer) => 
    headers.map((header) => fields[header](volunteer))
  );

  const csvContent = arrayToCSV(headers, rows);
  const defaultFilename = `volunteers-export-${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadFile(csvContent, filename || defaultFilename, 'text/csv');
};

/**
 * Export volunteers with statistics summary
 * @param volunteers - Array of volunteer profiles
 * @param includeStats - Whether to include summary statistics
 */
export const exportVolunteersWithStats = (
  volunteers: VolunteerProfile[],
  includeStats: boolean = true
): void => {
  let csvContent = '';

  // Add statistics header if requested
  if (includeStats) {
    const stats = {
      total: volunteers.length,
      approved: volunteers.filter((v) => v.status === 'approved').length,
      pending: volunteers.filter((v) => v.status === 'pending').length,
      rejected: volunteers.filter((v) => v.status === 'rejected').length,
    };

    csvContent += `NSS Volunteer Export Report\n`;
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;
    csvContent += `\n`;
    csvContent += `Summary Statistics\n`;
    csvContent += `Total Volunteers,${stats.total}\n`;
    csvContent += `Approved,${stats.approved}\n`;
    csvContent += `Pending,${stats.pending}\n`;
    csvContent += `Rejected,${stats.rejected}\n`;
    csvContent += `\n`;
    csvContent += `Detailed Data\n`;
  }

  // Add volunteer data
  const headers = [
    'Name',
    'KTU ID',
    'Phone',
    'Course',
    'Semester',
    'Unit',
    'Blood Group',
    'Status',
  ];

  const rows = volunteers.map((v) => [
    v.full_name,
    v.ktu_id,
    v.contact_number,
    v.course,
    v.semester,
    v.unit_id,
    v.blood_group,
    v.status,
  ]);

  csvContent += arrayToCSV(headers, rows);
  
  const filename = `volunteers-report-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export data to JSON format
 * @param data - Data to export
 * @param filename - Name of the file
 */
export const exportToJSON = <T>(data: T, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const defaultFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
  downloadFile(jsonContent, defaultFilename, 'application/json');
};
