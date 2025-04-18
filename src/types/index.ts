export interface Job {
  createdAt: string | number | Date;
  _id: string;
  postedBy?: {
    name: string;
    company: string;
  };
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
}

export interface Application {
  user: any;
  job: any;
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
  resume: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  company?: string;
}