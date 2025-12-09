// Mock data for applicants - 50 sample records
export interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  primarySkill: string;
  currentCity: string;
  preferredCity: string;
  experience: number;
  currentCompany: string;
  pastCompanies: string[];
  designation: string;
  currentCTC: number;
  expectedCTC: number;
  noticePeriod: string;
  education: {
    highest: string;
    degree: string;
    university: string;
    yearOfPassing: number;
    percentage: number;
  };
  status: 'Active' | 'Shortlisted' | 'Interview' | 'Hired' | 'Rejected' | 'On Hold';
  isFavorite: boolean;
  lastActive: string;
  registeredDate: string;
  resumeUpdated: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  communicationSkill: 'Excellent' | 'Good' | 'Average' | 'Poor';
  profilePhoto?: string;
  resumeUrl?: string;
}

const skills = [
  'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'Angular', 'Vue.js', 'TypeScript',
  'AWS', 'Azure', 'Docker', 'Kubernetes', 'Microservices', 'Spring Boot', 'Django',
  'Machine Learning', 'Data Science', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
  'DevOps', 'CI/CD', 'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL',
  'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Figma', 'UI/UX Design',
  'Sales', 'Marketing', 'Business Development', 'Project Management', 'Product Management',
  'Data Analysis', 'Power BI', 'Tableau', 'Excel', 'SAP', 'Oracle', 'Salesforce'
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Noida', 'Gurgaon', 'Ahmedabad'];
const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture', 'Capgemini', 'IBM', 'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'Ola', 'Uber', 'PhonePe', 'Razorpay'];
const designations = ['Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Project Manager', 'Data Analyst', 'Product Manager', 'Business Analyst', 'DevOps Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'QA Engineer', 'Team Lead', 'Architect', 'Consultant'];
const noticePeriods = ['Immediate', '15 Days', '30 Days', '60 Days', '90 Days', 'Notice Serving'];
const educationLevels = ['B.Tech', 'B.E.', 'MCA', 'M.Tech', 'MBA', 'BCA', 'B.Sc', 'M.Sc', 'PhD', 'Diploma'];
const universities = ['IIT Delhi', 'IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'SRM University', 'Pune University', 'Mumbai University', 'Delhi University', 'Anna University'];
const statuses: Applicant['status'][] = ['Active', 'Shortlisted', 'Interview', 'Hired', 'Rejected', 'On Hold'];
const communicationLevels: Applicant['communicationSkill'][] = ['Excellent', 'Good', 'Average', 'Poor'];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ['Priya', 'Rahul', 'Anita', 'Vikram', 'Sneha', 'Arjun', 'Kavita', 'Amit', 'Pooja', 'Rajesh', 'Deepika', 'Sanjay', 'Neha', 'Arun', 'Meera', 'Karan', 'Ritu', 'Vivek', 'Anjali', 'Rohit', 'Shruti', 'Nikhil', 'Swati', 'Gaurav', 'Pallavi'];
const lastNames = ['Sharma', 'Kumar', 'Patel', 'Singh', 'Reddy', 'Joshi', 'Verma', 'Gupta', 'Shah', 'Rao', 'Nair', 'Iyer', 'Mehta', 'Chopra', 'Malhotra', 'Bansal', 'Agarwal', 'Kapoor', 'Saxena', 'Bhat'];

const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const mockApplicants: Applicant[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const primarySkill = getRandomItem(skills);
  const experience = getRandomNumber(0, 15);
  const currentCTC = experience === 0 ? 0 : getRandomNumber(3, 8 + experience * 2);
  
  return {
    id: i + 1,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    phone: `+91 ${getRandomNumber(70000, 99999)}${getRandomNumber(10000, 99999)}`,
    skills: [primarySkill, ...getRandomItems(skills.filter(s => s !== primarySkill), getRandomNumber(2, 6))],
    primarySkill,
    currentCity: getRandomItem(cities),
    preferredCity: getRandomItem(cities),
    experience,
    currentCompany: experience === 0 ? 'Fresher' : getRandomItem(companies),
    pastCompanies: experience > 2 ? getRandomItems(companies, getRandomNumber(1, 3)) : [],
    designation: experience === 0 ? 'Fresher' : getRandomItem(designations),
    currentCTC: currentCTC,
    expectedCTC: currentCTC + getRandomNumber(2, 5),
    noticePeriod: getRandomItem(noticePeriods),
    education: {
      highest: getRandomItem(educationLevels),
      degree: getRandomItem(['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Business Administration']),
      university: getRandomItem(universities),
      yearOfPassing: getRandomNumber(2010, 2024),
      percentage: getRandomNumber(60, 95),
    },
    status: getRandomItem(statuses),
    isFavorite: Math.random() > 0.8,
    lastActive: generateDate(getRandomNumber(0, 30)),
    registeredDate: generateDate(getRandomNumber(30, 365)),
    resumeUpdated: generateDate(getRandomNumber(0, 60)),
    gender: getRandomItem(['Male', 'Female', 'Other']),
    age: getRandomNumber(21, 45),
    communicationSkill: getRandomItem(communicationLevels),
  };
});

// Skills for filter options
export const skillOptions = skills;
export const cityOptions = cities;
export const companyOptions = companies;
export const educationOptions = educationLevels;
export const noticePeriodOptions = noticePeriods;
export const statusOptions = statuses;
