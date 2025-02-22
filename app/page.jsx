"use client";
import { useEffect, useState } from "react";

import userStore from "./store/userStore";
import CommandButtons from "./components/CommandButtons";
import RealtimeDateTime from "./components/RealtimeDateTime";
import UserRecordsTable from "./components/UserRecordsTable";

export default function Home() {
  const { user } = userStore();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <RealtimeDateTime />
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

        <CommandButtons />

        <UserRecordsTable />
      </main>
    </div>
  );
}
