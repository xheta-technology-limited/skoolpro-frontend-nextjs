interface StaffDetails {
  // Personal
  firstName: string;
  middleName: string;
  lastName: string;
  religion: string;
  sex: string;
  dob: string;
  nationality: string;
  maritalStatus: string;
  photoUrl: string;

  // Role & Employment
  staffNumber: string;
  nationalProfNo: string;
  category: string;
  reportingManager: string;
  employmentType: string;
  employmentStarts: string;
  department: string;
  contractType: string;
  staffStatus: string;
  campus: string;

  // Contact
  homeAddress: string;
  emailAddress: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
}

export const staff: StaffDetails = {
  // Personal
  firstName: "Helen",
  middleName: "Mary",
  lastName: "Diana",
  religion: "Christian",
  sex: "Female",
  dob: "20/09/2014",
  nationality: "Nigerian",
  maritalStatus: "Married",
  photoUrl: "/images/staff-placeholder.jpg",

  // Role & Employment
  staffNumber: "EMP-001",
  nationalProfNo: "TRCN/2015/44213",
  category: "Teaching",
  reportingManager: "Halima Yusuf",
  employmentType: "Full time",
  employmentStarts: "29/07/2025",
  department: "Sciences",
  contractType: "Fulltime",
  staffStatus: "Active",
  campus: "Main Campus",

  // Contact
  homeAddress: "11, Crescent st. Yaba, Lagos",
  emailAddress: "helendiana@tsc.com",
  phoneNumber: "+234 818 358 1817",
  emergencyPhoneNumber: "+234 818 358 1817",
};

interface Qualification {
  id: string;
  type: string;
  qualification: string;
  institution: string;
  awarded: string;
  grade: string;
  regNo: string;
  expires: string;
}

export const qualifications: Qualification[] = [
  {
    id: "1",
    type: "Academic",
    qualification: "B.Ed Chemistry",
    institution: "University of Lagos",
    awarded: "2013",
    grade: "First Class",
    regNo: "-",
    expires: "-",
  },
  {
    id: "2",
    type: "Professional",
    qualification: "TRCN Licence",
    institution: "Teachers Council",
    awarded: "2015",
    grade: "-",
    regNo: "44213",
    expires: "Sept 2026",
  },
];
