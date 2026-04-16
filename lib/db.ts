import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  getDocs,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./firebase";

// Interfaces
export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  deadline: string;
  postedBy: string;
  createdAt: any;
  status: 'open' | 'closed';
}

export interface Application {
  id?: string;
  jobId: string;
  userId: string;
  studentName: string;
  companyName: string;
  jobTitle: string;
  status: 'applied' | 'shortlisted' | 'offer' | 'rejected' | 'placed';
  appliedAt: any;
}

export interface Resume {
  id?: string;
  userId: string;
  title: string;
  sections: {
    basics: {
      name: string;
      email: string;
      phone: string;
      location: string;
      summary: string;
    };
    experience: {
      id: string;
      company: string;
      role: string;
      dates: string;
      bullets: string[];
    }[];
    education: {
      id: string;
      school: string;
      degree: string;
      dates: string;
      gpa: string;
    }[];
    skills: {
      id: string;
      category: string;
      items: string[];
    }[];
  };
  createdAt: any;
  updatedAt: any;
}

export interface Activity {
  id?: string;
  userId: string;
  userName: string;
  type: 'post' | 'apply' | 'status_change' | 'verify';
  message: string;
  timestamp: any;
}

// Jobs Logic
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'status'>) => {
  return await addDoc(collection(db, "jobs"), {
    ...jobData,
    status: 'open',
    createdAt: serverTimestamp()
  });
};

// Resume Logic
export const createResume = async (userId: string, title: string) => {
  const initialData: Omit<Resume, 'id'> = {
    userId,
    title,
    sections: {
      basics: { name: "", email: "", phone: "", location: "", summary: "" },
      experience: [],
      education: [],
      skills: []
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  return await addDoc(collection(db, "resumes"), initialData);
};

export const updateResume = async (resumeId: string, data: Partial<Resume>) => {
  const docRef = doc(db, "resumes", resumeId);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const listenToUserResumes = (userId: string, callback: (resumes: Resume[]) => void) => {
  const q = query(collection(db, "resumes"), where("userId", "==", userId), orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const resumes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resume));
    callback(resumes);
  });
};

// Application Logic
export const applyToJob = async (
  userId: string, 
  userName: string, 
  job: Job
) => {
  // Create Application
  const appRef = await addDoc(collection(db, "applications"), {
    jobId: job.id,
    userId,
    studentName: userName,
    companyName: job.company,
    jobTitle: job.title,
    status: 'applied',
    appliedAt: serverTimestamp()
  });

  // Log Activity
  await addDoc(collection(db, "activity"), {
    userId,
    userName,
    type: 'apply',
    message: `applied to ${job.title} at ${job.company}`,
    timestamp: serverTimestamp()
  });

  return appRef;
};

// Telemetry Logic
export const listenToApplications = (userId: string, callback: (apps: Application[]) => void) => {
  const q = query(collection(db, "applications"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
    callback(apps);
  });
};

export const listenToAllJobs = (callback: (jobs: Job[]) => void) => {
  const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    callback(jobs);
  });
};

export const listenToActivity = (callback: (activities: Activity[]) => void) => {
  const q = query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(10));
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
    callback(activities);
  });
};
