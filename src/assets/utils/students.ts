export interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  ktuId?: string;
  semester: number;
  course: string;
  college?: string;
  joinedDate?: string;
}

export const demoStudents: Student[] = [
  {
    id: "1",
    name: "Arjun Krishnan",
    email: "arjun.krishnan@gmail.com",
    phoneNumber: "+91 9876543210",
    ktuId: "KTU2021CSE001",
    semester: 6,
    course: "Computer Science Engineering",
  },
  {
    id: "2",
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    phoneNumber: "+91 9876543211",
    ktuId: "KTU2021ECE015",
    semester: 5,
    course: "Electronics & Communication Engineering",
  },
  {
    id: "3",
    name: "Rohit Menon",
    email: "rohit.menon@gmail.com",
    phoneNumber: "+91 9876543212",
    ktuId: "KTU2020ME025",
    semester: 7,
    course: "Mechanical Engineering",
  },
  {
    id: "4",
    name: "Anjali Pillai",
    email: "anjali.pillai@gmail.com",
    phoneNumber: "+91 9876543213",
    ktuId: "KTU2021IT008",
    semester: 6,
    course: "Information Technology",
  },
  {
    id: "5",
    name: "Kiran Kumar",
    email: "kiran.kumar@gmail.com",
    phoneNumber: "+91 9876543214",
    ktuId: "KTU2022CSE012",
    semester: 4,
    course: "Computer Science Engineering",
  },
  {
    id: "6",
    name: "Sneha Raj",
    email: "sneha.raj@gmail.com",
    phoneNumber: "+91 9876543215",
    ktuId: "KTU2020EEE030",
    semester: 8,
    course: "Electrical & Electronics Engineering",
  },
  {
    id: "7",
    name: "Vishnu Prasad",
    email: "vishnu.prasad@gmail.com",
    phoneNumber: "+91 9876543216",
    ktuId: "KTU2021CE018",
    semester: 5,
    course: "Civil Engineering",
  },
  {
    id: "8",
    name: "Lakshmi Mohan",
    email: "lakshmi.mohan@gmail.com",
    phoneNumber: "+91 9876543217",
    ktuId: "KTU2022ECE009",
    semester: 3,
    course: "Electronics & Communication Engineering",
  },
  {
    id: "9",
    name: "Arun Sasi",
    email: "arun.sasi@gmail.com",
    phoneNumber: "+91 9876543218",
    ktuId: "KTU2020CSE045",
    semester: 8,
    course: "Computer Science Engineering",
  },
  {
    id: "10",
    name: "Deepika Nair",
    email: "deepika.nair@gmail.com",
    phoneNumber: "+91 9876543219",
    ktuId: "KTU2021IT022",
    semester: 6,
    course: "Information Technology",
  },
];
