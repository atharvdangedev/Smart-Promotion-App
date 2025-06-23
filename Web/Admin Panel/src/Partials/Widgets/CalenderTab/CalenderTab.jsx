/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";

const CalendarTab = ({ setDate }) => {
  // eslint-disable-next-line no-unused-vars
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [activeDate, setActiveDate] = useState(new Date());
  const navRef = useRef(null);

  // Generate days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({
        date: i,
        day: date.toLocaleString("en-US", { weekday: "short" }),
      });
    }
    setDaysInMonth(days);
  }, [currentDate]);

  const handleScroll = (evt) => {
    if (navRef.current) {
      navRef.current.scrollLeft += evt.deltaY;
    }
  };

  const handleDate = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // Create date with local timezone
    const selectedDate = new Date(year, month, day);

    setActiveDate(selectedDate);

    // Format date manually to avoid timezone issues
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    setDate(formattedDate);
  };

  return (
    <div className="calendar-tab">
      <ul
        ref={navRef}
        className="nav nav-pills text-muted text-uppercase"
        role="tablist"
        onWheel={handleScroll}
      >
        {daysInMonth.map((day, index) => {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const dayDate = new Date(year, month, day.date);
          const isActive = activeDate.toDateString() === dayDate.toDateString();

          return (
            <li key={index} className="nav-item">
              <span>{day.day}</span>
              <button
                onClick={() => handleDate(day.date)}
                className={`nav-link ${isActive ? "active" : ""}`}
                data-bs-target={`#c_date_${day.date}`}
              >
                {day.date.toString().padStart(2, "0")}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CalendarTab;
