interface Certificate {
  id: string;
  type:
    | "Blood Donation"
    | "Tree Plantation"
    | "Community Service"
    | "Environmental";
  reason: string;
  status: "pending" | "approved" | "rejected";
  verifiedBy?: string;
  submissionDate: string;
  college: string;
  details: string;
}

interface Activity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  studentsParticipated: number;
  images: string[];
  date: string;
  location: string;
  organizer: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: "1",
    type: "Blood Donation",
    reason: "Campus Blood Drive 2024",
    status: "approved",
    verifiedBy: "Dr. Smith",
    submissionDate: "2024-01-15",
    college: "ABC College",
    details: "Donated blood during the annual campus drive",
  },
  {
    id: "2",
    type: "Tree Plantation",
    reason: "World Environment Day",
    status: "pending",
    submissionDate: "2024-02-20",
    college: "ABC College",
    details: "Planted 50 saplings in the college campus",
  },
  {
    id: "3",
    type: "Community Service",
    reason: "Local Community Help",
    status: "approved",
    verifiedBy: "Prof. Johnson",
    submissionDate: "2024-03-10",
    college: "ABC College",
    details: "Helped in organizing community event",
  },
  {
    id: "4",
    type: "Environmental",
    reason: "Beach Cleanup",
    status: "rejected",
    submissionDate: "2024-01-25",
    college: "ABC College",
    details: "Participated in coastal cleanup drive",
  },
  {
    id: "5",
    type: "Blood Donation",
    reason: "Emergency Blood Drive",
    status: "pending",
    submissionDate: "2024-03-15",
    college: "ABC College",
    details: "Emergency blood donation for accident victim",
  },
  {
    id: "6",
    type: "Tree Plantation",
    reason: "Earth Day Celebration",
    status: "approved",
    verifiedBy: "Dr. Wilson",
    submissionDate: "2024-04-22",
    college: "ABC College",
    details: "Planted trees during Earth Day event",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Campus Cleanup Drive",
    subtitle: "Clean Green Initiative",
    description:
      "A comprehensive cleanup drive covering the entire college campus and surrounding areas. Students worked together to collect waste, segregate recyclables, and plant new saplings.",
    studentsParticipated: 150,
    images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=60",
    ],
    date: "2024-01-10",
    location: "College Campus",
    organizer: "NSS Unit ABC",
  },
  {
    id: "2",
    title: "Blood Donation Camp",
    subtitle: "Saving Lives Together",
    description:
      "Annual blood donation camp organized in collaboration with local hospitals. The event successfully collected over 200 units of blood.",
    studentsParticipated: 200,
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=300&q=60",
    ],
    date: "2024-02-05",
    location: "College Auditorium",
    organizer: "NSS Unit ABC",
  },
  {
    id: "3",
    title: "Tree Plantation Drive",
    subtitle: "Green Future Initiative",
    description:
      "Large-scale tree plantation drive in collaboration with the forest department. Over 500 saplings were planted across different locations.",
    studentsParticipated: 180,
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=60",
    ],
    date: "2024-03-15",
    location: "Multiple Locations",
    organizer: "NSS Unit ABC",
  },
];

export type { Certificate, Activity };
