import { VolunteerFormFields } from '@/types/VolunteerFormSchema';

export interface Volunteer extends VolunteerFormFields {
  id: string;
  registrationDate: string;
  status: 'Active' | 'Inactive' | 'New';
}

/**
 * Create a mock File object for demo data
 */
const createMockFile = (filename: string): File => {
  const blob = new Blob(['mock file content'], { type: 'image/jpeg' });
  return new File([blob], filename, { type: 'image/jpeg' });
};

export const demoVolunteers: Volunteer[] = [
  {
    id: "1",
    name: "Arjun Krishnan",
    unit: "NSS UNIT 1",
    semster: "S6" as const,
    course: "B.Tech Computer Science",
    admissionYear: 2021,
    ktuId: "KTU2021CSE001",
    gender: "Male" as const,
    dob: "2003-05-15",
    contactNumber: "9876543210",
    whatsappNumber: "9876543210",
    religion: "Hindu" as const,
    community: "General" as const,
    bloodGroup: "B+" as const,
    pincode: "680001",
    height: "175",
    weight: "70",
    district: "Thrissur" as const,
    taluk: "Thrissur",
    village: "Thrissur",
    parent: "Krishnan Nair",
    parentContact: "9876543200",
    permanentAddress: "123, Main Street, Thrissur, Kerala - 680001",
    photo: createMockFile("arjun_photo.jpg"),
    signature: createMockFile("arjun_signature.jpg"),
    languagesKnown: ["English", "Hindi", "Malayalam"] as const,
    registrationDate: "2024-08-15",
    status: "Active"
  },
  {
    id: "2",
    name: "Priya Nair",
    unit: "NSS UNIT 1",
    semster: "S5" as const,
    course: "B.Tech Electronics",
    admissionYear: 2022,
    ktuId: "KTU2022ECE015",
    gender: "Female" as const,
    dob: "2004-03-22",
    contactNumber: "9876543211",
    whatsappNumber: "9876543211",
    religion: "Hindu" as const,
    community: "General" as const,
    bloodGroup: "A+" as const,
    pincode: "680002",
    height: "165",
    weight: "55",
    district: "Thrissur" as const,
    taluk: "Thrissur",
    village: "Thrissur",
    parent: "Nair Kumar",
    parentContact: "9876543201",
    permanentAddress: "456, Church Road, Thrissur, Kerala - 680002",
    photo: createMockFile("priya_photo.jpg"),
    signature: createMockFile("priya_signature.jpg"),
    languagesKnown: ["English", "Malayalam"] as const,
    registrationDate: "2024-08-20",
    status: "Active"
  },
  {
    id: "3",
    name: "Rohit Menon",
    unit: "NSS UNIT 2",
    semster: "S7" as const,
    course: "B.Tech Mechanical",
    admissionYear: 2020,
    ktuId: "KTU2020ME025",
    gender: "Male" as const,
    dob: "2002-11-08",
    contactNumber: "9876543212",
    whatsappNumber: "9876543212",
    religion: "Hindu" as const,
    community: "OBC" as const,
    bloodGroup: "O+" as const,
    pincode: "680003",
    height: "180",
    weight: "75",
    district: "Kozhikode" as const,
    taluk: "Kozhikode",
    village: "Kozhikode",
    parent: "Menon Rajesh",
    parentContact: "9876543202",
    permanentAddress: "789, Temple Street, Kozhikode, Kerala - 680003",
    photo: createMockFile("rohit_photo.jpg"),
    signature: createMockFile("rohit_signature.jpg"),
    languagesKnown: ["English", "Hindi", "Malayalam"] as const,
    registrationDate: "2024-07-10",
    status: "Active"
  },
  {
    id: "4",
    name: "Anjali Reddy",
    unit: "NSS UNIT 1",
    semster: "S4" as const,
    course: "BCA",
    admissionYear: 2023,
    ktuId: "KTU2023IT008",
    gender: "Female" as const,
    dob: "2005-01-12",
    contactNumber: "9876543213",
    whatsappNumber: "9876543213",
    religion: "Hindu" as const,
    community: "General" as const,
    bloodGroup: "AB+" as const,
    pincode: "680004",
    height: "160",
    weight: "50",
    district: "Ernakulam" as const,
    taluk: "Ernakulam",
    village: "Ernakulam",
    parent: "Reddy Suresh",
    parentContact: "9876543203",
    permanentAddress: "321, Market Road, Ernakulam, Kerala - 680004",
    photo: createMockFile("anjali_photo.jpg"),
    signature: createMockFile("anjali_signature.jpg"),
    languagesKnown: ["English", "Telugu", "Malayalam"] as const,
    registrationDate: "2024-09-01",
    status: "New"
  },
  {
    id: "5",
    name: "Mohammed Ali",
    unit: "NSS UNIT 3",
    semster: "S8" as const,
    course: "B.Tech Civil",
    admissionYear: 2019,
    ktuId: "KTU2019CE012",
    gender: "Male" as const,
    dob: "2001-07-18",
    contactNumber: "9876543214",
    whatsappNumber: "9876543214",
    religion: "Muslim" as const,
    community: "OBC" as const,
    bloodGroup: "B-" as const,
    pincode: "680005",
    height: "172",
    weight: "68",
    district: "Malappuram" as const,
    taluk: "Malappuram",
    village: "Malappuram",
    parent: "Ali Hassan",
    parentContact: "9876543204",
    permanentAddress: "654, New Colony, Malappuram, Kerala - 680005",
    photo: createMockFile("ali_photo.jpg"),
    signature: createMockFile("ali_signature.jpg"),
    languagesKnown: ["English", "Hindi", "Malayalam"] as const,
    registrationDate: "2024-06-15",
    status: "Active"
  },
  {
    id: "6",
    name: "Sreya Thomas",
    unit: "NSS UNIT 2",
    semster: "S3" as const,
    course: "B.Tech Electrical",
    admissionYear: 2023,
    ktuId: "KTU2023EEE019",
    gender: "Female" as const,
    dob: "2005-09-25",
    contactNumber: "9876543215",
    whatsappNumber: "9876543215",
    religion: "Christian" as const,
    community: "General" as const,
    bloodGroup: "A-" as const,
    pincode: "680006",
    height: "158",
    weight: "52",
    district: "Kottayam" as const,
    taluk: "Kottayam",
    village: "Kottayam",
    parent: "Thomas George",
    parentContact: "9876543205",
    permanentAddress: "987, Church Lane, Kottayam, Kerala - 680006",
    photo: createMockFile("sreya_photo.jpg"),
    signature: createMockFile("sreya_signature.jpg"),
    languagesKnown: ["English", "Malayalam"] as const,
    registrationDate: "2024-09-05",
    status: "New"
  },
  {
    id: "7",
    name: "Kiran Kumar",
    unit: "NSS UNIT 1",
    semster: "S6" as const,
    course: "B.Tech Computer Science",
    admissionYear: 2021,
    ktuId: "KTU2021CSE045",
    gender: "Male" as const,
    dob: "2003-02-10",
    contactNumber: "9876543216",
    whatsappNumber: "9876543216",
    religion: "Hindu" as const,
    community: "SC" as const,
    bloodGroup: "O-" as const,
    pincode: "680007",
    height: "178",
    weight: "72",
    district: "Thrissur" as const,
    taluk: "Thrissur",
    village: "Thrissur",
    parent: "Kumar Raj",
    parentContact: "9876543206",
    permanentAddress: "111, Park Avenue, Thrissur, Kerala - 680007",
    photo: createMockFile("kiran_photo.jpg"),
    signature: createMockFile("kiran_signature.jpg"),
    languagesKnown: ["English", "Hindi", "Malayalam"] as const,
    registrationDate: "2024-08-10",
    status: "Active"
  },
  {
    id: "8",
    name: "Meera Nair",
    unit: "NSS UNIT 4",
    semster: "S4" as const,
    course: "B.Tech Electronics",
    admissionYear: 2023,
    ktuId: "KTU2023ECE022",
    gender: "Female" as const,
    dob: "2005-04-18",
    contactNumber: "9876543217",
    whatsappNumber: "9876543217",
    religion: "Hindu" as const,
    community: "General" as const,
    bloodGroup: "AB-" as const,
    pincode: "680008",
    height: "162",
    weight: "54",
    district: "Kannur" as const,
    taluk: "Kannur",
    village: "Kannur",
    parent: "Nair Vinod",
    parentContact: "9876543207",
    permanentAddress: "222, Lake View, Kannur, Kerala - 680008",
    photo: createMockFile("meera_photo.jpg"),
    signature: createMockFile("meera_signature.jpg"),
    languagesKnown: ["English", "Malayalam", "Tamil"] as const,
    registrationDate: "2024-09-02",
    status: "New"
  },
  {
    id: "9",
    name: "Ravi Varma",
    unit: "NSS UNIT 5",
    semster: "S2" as const,
    course: "B.Tech Mechanical",
    admissionYear: 2024,
    ktuId: "KTU2024ME003",
    gender: "Male" as const,
    dob: "2006-06-30",
    contactNumber: "9876543218",
    whatsappNumber: "9876543218",
    religion: "Hindu" as const,
    community: "ST" as const,
    bloodGroup: "A+" as const,
    pincode: "680009",
    height: "170",
    weight: "65",
    district: "Wayanad" as const,
    taluk: "Wayanad",
    village: "Wayanad",
    parent: "Varma Sunil",
    parentContact: "9876543208",
    permanentAddress: "333, River Side, Wayanad, Kerala - 680009",
    photo: createMockFile("ravi_photo.jpg"),
    signature: createMockFile("ravi_signature.jpg"),
    languagesKnown: ["English", "Malayalam"] as const,
    registrationDate: "2024-09-10",
    status: "New"
  },
  {
    id: "10",
    name: "Divya Pillai",
    unit: "NSS UNIT 1",
    semster: "S7" as const,
    course: "BBA",
    admissionYear: 2020,
    ktuId: "KTU2020IT011",
    gender: "Female" as const,
    dob: "2002-12-05",
    contactNumber: "9876543219",
    whatsappNumber: "9876543219",
    religion: "Hindu" as const,
    community: "General" as const,
    bloodGroup: "B+" as const,
    pincode: "680010",
    height: "168",
    weight: "58",
    district: "Thiruvananthapuram" as const,
    taluk: "Thiruvananthapuram",
    village: "Thiruvananthapuram",
    parent: "Pillai Raman",
    parentContact: "9876543209",
    permanentAddress: "444, Garden Colony, Thiruvananthapuram, Kerala - 680010",
    photo: createMockFile("divya_photo.jpg"),
    signature: createMockFile("divya_signature.jpg"),
    languagesKnown: ["English", "Malayalam", "Hindi"] as const,
    registrationDate: "2024-07-25",
    status: "Active"
  }
];

// Helper functions for statistics
export const getVolunteerStats = () => {
  const totalVolunteers = demoVolunteers.length;
  const activeVolunteers = demoVolunteers.filter(v => v.status === 'Active').length;
  const newVolunteers = demoVolunteers.filter(v => v.status === 'New').length;
  const avgSemester = Math.round(
    demoVolunteers.reduce((sum, v) => sum + parseInt(v.semster.substring(1)), 0) / totalVolunteers * 10
  ) / 10;
  
  const courses = [...new Set(demoVolunteers.map(v => v.course))];
  const activeCourses = courses.length;

  return {
    totalVolunteers,
    activeVolunteers,
    newVolunteers,
    avgSemester,
    activeCourses
  };
};

// Get volunteers by unit
export const getVolunteersByUnit = (unit: string): Volunteer[] => {
  return demoVolunteers.filter(v => v.unit === unit);
};

// Get volunteers by status
export const getVolunteersByStatus = (status: 'Active' | 'Inactive' | 'New'): Volunteer[] => {
  return demoVolunteers.filter(v => v.status === status);
};

// Get volunteers by semester
export const getVolunteersBySemester = (semester: string): Volunteer[] => {
  return demoVolunteers.filter(v => v.semster === semester);
};

// Search volunteers by name or KTU ID
export const searchVolunteers = (query: string): Volunteer[] => {
  const lowerQuery = query.toLowerCase();
  return demoVolunteers.filter(
    v => v.name.toLowerCase().includes(lowerQuery) || 
         v.ktuId.toLowerCase().includes(lowerQuery)
  );
};