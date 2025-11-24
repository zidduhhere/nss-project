import { VolunteerFormFields } from '@/types/VolunteerFormSchema';

/**
 * Generate a mock File object for testing
 * @param filename - Name of the file
 * @param type - MIME type of the file
 * @returns Mock File object
 */
const createMockFile = (filename: string, type: string): File => {
  const blob = new Blob(['mock file content'], { type });
  return new File([blob], filename, { type });
};

/**
 * Generate random mock volunteer data for testing
 * @returns Complete volunteer form data with all required fields
 */
export const generateMockVolunteerData = (): VolunteerFormFields => {
  const names = [
    'Arjun Kumar',
    'Priya Sharma',
    'Rahul Menon',
    'Sneha Nair',
    'Aditya Krishnan',
    'Meera Pillai',
    'Karthik Raj',
    'Anjali Varma'
  ];

  const courses = [
    'B.Tech Computer Science',
    'B.Tech Electronics',
    'B.Tech Mechanical',
    'B.Tech Civil',
    'BBA',
    'BCA'
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCourse = courses[Math.floor(Math.random() * courses.length)];
  const currentYear = new Date().getFullYear();
  const randomAdmissionYear = currentYear - Math.floor(Math.random() * 4);

  return {
    // Institution Details
    unit: 'NSS UNIT 1',
    semester: 'S3',
    course: randomCourse,
    admissionYear: randomAdmissionYear,
    ktuId: `KTU${Math.floor(Math.random() * 1000000)}`,

    // Personal Details
    name: randomName,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    dob: '2003-05-15',
    contactNumber: `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    whatsappNumber: `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    religion: 'Hindu',
    community: 'General',
    bloodGroup: 'O+',
    height: '170',
    weight: '65',

    // Address Details
    district: 'Kozhikode',
    taluk: 'Vadakara',
    village: 'Nadapuram',
    pincode: '673001',
    permanentAddress: '123 Main Street, Near Temple, Kozhikode District',

    // Parent Details
    parent: `${randomName.split(' ')[0]}'s Parent`,
    parentContact: `94${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,

    // Documents (Mock Files)
    photo: createMockFile('photo.jpg', 'image/jpeg'),
    signature: createMockFile('signature.jpg', 'image/jpeg'),

    // Languages Known
    languagesKnown: ['English', 'Malayalam'],
  };
};

/**
 * Predefined mock volunteer data sets for different testing scenarios
 */
export const mockVolunteerDataSets = {
  /**
   * Complete valid data - should pass all validations
   */
  complete: {
    unit: 'NSS UNIT 1',
    semester: 'S5',
    course: 'B.Tech Computer Science',
    admissionYear: 2021,
    ktuId: 'KTU123456789',
    name: 'Arjun Kumar Menon',
    gender: 'Male',
    dob: '2003-08-20',
    contactNumber: '9876543210',
    whatsappNumber: '9876543210',
    religion: 'Hindu',
    community: 'OBC',
    bloodGroup: 'B+',
    height: '175',
    weight: '70',
    district: 'Kozhikode',
    taluk: 'Vadakara',
    village: 'Nadapuram',
    pincode: '673001',
    permanentAddress: '123 MG Road, Near Bus Stand, Vadakara, Kozhikode',
    parent: 'Kumar Menon',
    parentContact: '9123456789',
    photo: createMockFile('arjun_photo.jpg', 'image/jpeg'),
    signature: createMockFile('arjun_signature.jpg', 'image/jpeg'),
    languagesKnown: ['English', 'Malayalam', 'Hindi'],
  } as VolunteerFormFields,

  /**
   * Female student from different district
   */
  female: {
    unit: 'NSS UNIT 2',
    semester: 'S3',
    course: 'B.Tech Electronics',
    admissionYear: 2022,
    ktuId: 'KTU987654321',
    name: 'Priya Sharma',
    gender: 'Female',
    dob: '2004-03-15',
    contactNumber: '8765432109',
    whatsappNumber: '8765432109',
    religion: 'Hindu',
    community: 'General',
    bloodGroup: 'O+',
    height: '160',
    weight: '55',
    district: 'Thiruvananthapuram',
    taluk: 'Neyyattinkara',
    village: 'Balaramapuram',
    pincode: '695501',
    permanentAddress: '456 Beach Road, Near School, Neyyattinkara',
    parent: 'Sharma',
    parentContact: '9234567890',
    photo: createMockFile('priya_photo.jpg', 'image/jpeg'),
    signature: createMockFile('priya_signature.jpg', 'image/jpeg'),
    languagesKnown: ['English', 'Hindi'],
  } as VolunteerFormFields,

  /**
   * Minimal valid data - only required fields
   */
  minimal: {
    unit: 'NSS UNIT 3',
    semester: 'S1',
    course: 'BCA',
    admissionYear: 2024,
    ktuId: 'KTU111222333',
    name: 'Karthik Raj',
    gender: 'Male',
    dob: '2005-01-01',
    contactNumber: '9999999999',
    whatsappNumber: '9999999999',
    religion: 'Hindu',
    community: 'General',
    bloodGroup: 'A+',
    height: '170',
    weight: '65',
    district: 'Kozhikode',
    taluk: 'Kozhikode',
    village: 'Kozhikode',
    pincode: '673001',
    permanentAddress: 'Test Address',
    parent: 'Test Parent',
    parentContact: '9000000000',
    photo: createMockFile('test_photo.jpg', 'image/jpeg'),
    signature: createMockFile('test_signature.jpg', 'image/jpeg'),
    languagesKnown: ['English'],
  } as VolunteerFormFields,

  /**
   * Data with edge cases
   */
  edgeCase: {
    unit: 'NSS UNIT 10',
    semester: 'S8',
    course: 'B.Tech Mechanical Engineering with specialization in Robotics',
    admissionYear: 2020,
    ktuId: 'KTU9999999999',
    name: 'Aadhithya Vijayakumar Krishnamoorthy',
    gender: 'Male',
    dob: '2002-12-31',
    contactNumber: '9876543210',
    whatsappNumber: '9123456789',
    religion: 'Christian',
    community: 'SC',
    bloodGroup: 'AB-',
    height: '195',
    weight: '95',
    district: 'Kozhikode',
    taluk: 'Vadakara',
    village: 'Nadapuram',
    pincode: '673123',
    permanentAddress: 'Very Long Address Line 1, Very Long Address Line 2, Near Some Landmark, Some Area, Some District, Kerala State India',
    parent: 'Vijayakumar Krishnamoorthy Raghavan',
    parentContact: '9999999999',
    photo: createMockFile('long_name_photo.jpg', 'image/jpeg'),
    signature: createMockFile('long_name_signature.jpg', 'image/jpeg'),
    languagesKnown: ['English', 'Malayalam', 'Hindi'],
  } as VolunteerFormFields,
};

/**
 * Generate multiple mock volunteers for bulk testing
 * @param count - Number of mock volunteers to generate
 * @returns Array of mock volunteer data
 */
export const generateMultipleMockVolunteers = (count: number): VolunteerFormFields[] => {
  return Array.from({ length: count }, () => generateMockVolunteerData());
};

/**
 * Console log formatted volunteer data for debugging
 * @param data - Volunteer form data to log
 */
export const logVolunteerData = (data: VolunteerFormFields) => {
  console.group('📋 Volunteer Registration Data');
  
  console.group('🏫 Institution Details');
  console.log('Unit:', data.unit);
  console.log('Semester:', data.semester);
  console.log('Course:', data.course);
  console.log('Admission Year:', data.admissionYear);
  console.log('KTU ID:', data.ktuId);
  console.groupEnd();

  console.group('👤 Personal Details');
  console.log('Name:', data.name);
  console.log('Gender:', data.gender);
  console.log('DOB:', data.dob);
  console.log('Contact:', data.contactNumber);
  console.log('WhatsApp:', data.whatsappNumber);
  console.log('Religion:', data.religion);
  console.log('Community:', data.community);
  console.log('Blood Group:', data.bloodGroup);
  console.log('Height:', data.height, 'cm');
  console.log('Weight:', data.weight, 'kg');
  console.groupEnd();

  console.group('📍 Address Details');
  console.log('District:', data.district);
  console.log('Taluk:', data.taluk);
  console.log('Village:', data.village);
  console.log('Pincode:', data.pincode);
  console.log('Address:', data.permanentAddress);
  console.groupEnd();

  console.group('👨‍👩‍👦 Parent Details');
  console.log('Parent Name:', data.parent);
  console.log('Parent Contact:', data.parentContact);
  console.groupEnd();

  console.group('📄 Documents');
  console.log('Photo:', data.photo?.name, `(${(data.photo?.size || 0 / 1024).toFixed(2)} KB)`);
  console.log('Signature:', data.signature?.name, `(${(data.signature?.size || 0 / 1024).toFixed(2)} KB)`);
  console.groupEnd();

  console.group('🗣️ Languages Known');
  console.log(data.languagesKnown?.join(', ') || 'None');
  console.groupEnd();

  console.groupEnd();
};