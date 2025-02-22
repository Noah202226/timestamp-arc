import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import userStore from "../store/userStore";
import * as XLSX from "xlsx";

const UserRecordsTable = () => {
  const { user, userRecords, setUserRecords } = userStore();
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "timeRecords"),
      where("userRef", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = querySnapshot.docs.map((doc) => doc.data());
      setUserRecords(records);
    });

    return () => unsubscribe();
  }, [user, setUserRecords]);

  useEffect(() => {
    const calculateTotalHours = () => {
      const total = userRecords.reduce((sum, record) => {
        return sum + (parseFloat(record.hoursWorked) || 0);
      }, 0);
      setTotalHours(total);
    };

    calculateTotalHours();
  }, [userRecords]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");
    XLSX.writeFile(workbook, "UserRecords.xlsx");
  };

  return (
    <div>
      <h2>Total Hours Worked: {totalHours.toFixed(2)}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Time In
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Time Out
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Hours Worked
            </th>
          </tr>
        </thead>
        <tbody>
          {userRecords.map((record, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {record.date}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {record.timeIn}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {record.timeOut}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {record.hoursWorked}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="3"
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "right",
              }}
            >
              Total Hours
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {totalHours.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={exportToExcel} className="btn btn-primary mt-4">
        Export to Excel
      </button>
    </div>
  );
};

export default UserRecordsTable;
