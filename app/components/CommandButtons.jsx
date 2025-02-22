import React, { useState, useEffect } from "react";
import userStore from "../store/userStore";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const CommandButtons = () => {
  const { user } = userStore();
  const [isLoggedInToday, setIsLoggedInToday] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInToday = await checkUserIsLoggedInThisDay();
      setIsLoggedInToday(loggedInToday);
      if (loggedInToday) {
        const timedOutToday = await checkUserHasTimedOutThisDay();
        setHasTimedOut(timedOutToday);
      }
    };

    checkLoginStatus();
  }, [user]);

  const checkUserIsLoggedInThisDay = async () => {
    if (!user) return false;

    const today = new Date().toLocaleDateString();
    const q = query(
      collection(db, "timeRecords"),
      where("userRef", "==", user.uid),
      where("date", "==", today)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkUserHasTimedOutThisDay = async () => {
    if (!user) return false;

    const today = new Date().toLocaleDateString();
    const q = query(
      collection(db, "timeRecords"),
      where("userRef", "==", user.uid),
      where("date", "==", today),
      where("timeOut", "!=", null)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const timeIn = async () => {
    const docRef = await addDoc(collection(db, "timeRecords"), {
      userRef: user.uid,
      date: new Date().toLocaleDateString(),
      timeIn: new Date().toLocaleTimeString(),
    });
    console.log("Document written with ID: ", docRef.id);
    setIsLoggedInToday(true);
  };

  const timeOut = async () => {
    const today = new Date().toLocaleDateString();
    const q = query(
      collection(db, "timeRecords"),
      where("userRef", "==", user.uid),
      where("date", "==", today)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const record = querySnapshot.docs[0];
      const timeIn = new Date(`${today} ${record.data().timeIn}`);
      const timeOut = new Date();
      const hoursWorked = ((timeOut - timeIn) / (1000 * 60 * 60)).toFixed(2);

      await updateDoc(doc(db, "timeRecords", record.id), {
        timeOut: timeOut.toLocaleTimeString(),
        hoursWorked: hoursWorked,
      });

      console.log("Document updated with ID: ", record.id);
      setHasTimedOut(true);
    }
  };

  if (user) {
    return (
      <div className="w-full flex justify-end my-2 items-end">
        {!isLoggedInToday ? (
          <button className="btn btn-primary" onClick={timeIn}>
            Time In
          </button>
        ) : !hasTimedOut ? (
          <button className="btn btn-secondary" onClick={timeOut}>
            Time Out
          </button>
        ) : (
          <p className="text-green-600">
            You have completed your time log for today.
          </p>
        )}
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-red-600 text-center text-2xl">Login first</h2>
    </div>
  );
};

export default CommandButtons;
