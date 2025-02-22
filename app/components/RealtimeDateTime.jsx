import React, { useEffect, useState } from "react";

const RealtimeDateTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
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
  );
};

export default RealtimeDateTime;
