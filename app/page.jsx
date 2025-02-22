"use client";
import { useEffect, useState } from "react";

import userStore from "./store/userStore";

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const [records, setRecords] = useState([
    { date: "2025-02-20", timeIn: "08:00 AM", timeOut: "04:00 PM" },
    { date: "2025-02-21", timeIn: "09:00 AM", timeOut: "05:00 PM" },
  ]);

  const { user } = userStore();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div className="text-white text-lg font-semibold">
        <h1 className="text-3xl font-bold text-right">
          {time.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })}
        </h1>
      </div>

      <header
        style={{ textAlign: "center", marginBottom: "40px", marginTop: "40px" }}
      >
        <h1 className="text-4xl font-medium">Welcome to the Time In/Out App</h1>
        <p>Track your work hours efficiently and effortlessly.</p>
      </header>

      <main>
        <h2 className="text-2xl font-medium">
          Time Records: {user?.displayName}
        </h2>
        <p>Here are your time records for the week:</p>
        <br />

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
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
