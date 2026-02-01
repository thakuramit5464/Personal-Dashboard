import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AttendanceRecord {
  id: string;
  type: "clock_in" | "clock_out";
  imageUrl: string;
  timestamp: Timestamp;
}

const ATTENDANCE_COLLECTION = "attendance"; // Subcollection logic: users/{uid}/attendance

export async function clockIn(userId: string, imageUrl: string) {
  const userAttendanceRef = collection(db, "users", userId, "attendance");
  await addDoc(userAttendanceRef, {
    type: "clock_in",
    imageUrl,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function clockOut(userId: string, imageUrl: string) {
  const userAttendanceRef = collection(db, "users", userId, "attendance");
  await addDoc(userAttendanceRef, {
    type: "clock_out",
    imageUrl,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function getLatestAttendance(userId: string): Promise<AttendanceRecord | null> {
  const userAttendanceRef = collection(db, "users", userId, "attendance");
  const q = query(
    userAttendanceRef, 
    orderBy("timestamp", "desc"), 
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as AttendanceRecord;
}

export async function getAttendanceHistory(userId: string, limitCount = 50): Promise<AttendanceRecord[]> {
  const userAttendanceRef = collection(db, "users", userId, "attendance");
  const q = query(
    userAttendanceRef, 
    orderBy("timestamp", "desc"), 
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as AttendanceRecord[];
}
