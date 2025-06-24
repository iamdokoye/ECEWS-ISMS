// studentsCalendar.js

document.addEventListener("DOMContentLoaded", () => {
  const calendarBody = document.getElementById("calendar-body");
  const monthLabel = document.getElementById("month-label");
  const logDate = document.getElementById("log-date");
  const logBody = document.querySelector(".log-body");
  const signatureText = document.getElementById("signatureText");
  const sendFeedback = document.getElementById("sendFeedback");

  let currentDate = new Date();
  let selectedDate = new Date();
  const logs = {}; // Temporary in-memory log storage

  function renderCalendar(date) {
    calendarBody.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthLabel.textContent = date.toLocaleDateString("en-US", { month: "long" });
    document.querySelector(".selected-year").textContent = year;

    let startDay = firstDay.getDay();
    let totalDays = lastDay.getDate();

    let row = document.createElement("tr");
    for (let i = 0; i < startDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= totalDays; day++) {
      if ((startDay + day - 1) % 7 === 0) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }

      const cell = document.createElement("td");
      cell.textContent = day;
      cell.className = "calendar-day";

      const thisDate = new Date(year, month, day);
      if (
        thisDate.toDateString() === new Date().toDateString()
      ) {
        cell.classList.add("today");
      }

      cell.addEventListener("click", () => {
        selectedDate = thisDate;
        updateLogPanel(selectedDate);
      });

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }

  function updateLogPanel(date) {
    const key = date.toISOString().split("T")[0];
    logDate.textContent = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric"
    });

    const content = logs[key];
    if (content) {
      logBody.innerHTML = `<p>${content}</p>`;
    } else {
      logBody.innerHTML = `<p class="empty-log-message">You haven’t filled any log for today</p>`;
    }
  }

  sendFeedback.addEventListener("click", () => {
    const key = selectedDate.toISOString().split("T")[0];
    const text = signatureText.value.trim();
    if (text) {
      logs[key] = text;
      updateLogPanel(selectedDate);
      signatureText.value = "";
      document.getElementById("overlay").style.display = "none";
    }
  });

  document.querySelector(".addLogBtn").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "flex";
  });

  document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
  });

  renderCalendar(currentDate);
  updateLogPanel(currentDate);
});
