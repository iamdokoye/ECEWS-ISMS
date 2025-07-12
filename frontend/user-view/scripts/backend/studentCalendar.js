const studentId = localStorage.getItem('studentId'); // Ensure this is set during login
let logsMap = {};
const apiBase = window.API_BASE;

const fetchStudentLogs = async () => {
  if (!studentId) {
    console.error("Student ID not found.");
    return;
  }

  try {
    const res = await fetch(`${apiBase}/logs/${studentId}`);
    
    // Check if response is successful
    if (res.ok) {
      const logs = await res.json();
      logs.forEach(log => {
        logsMap[log.log_date] = log; // Store logs by date for easy retrieval
      });
    } else {
      console.error("Failed to fetch logs:", res.statusText);
    }
  } catch (err) {
    console.error("Error fetching logs:", err);
  }
};

const saveLog = async (date, content) => {
  if (!date || !content) {
    console.error("Date and content are required to save the log.");
    return;
  }

  try {
    const res = await fetch(`${apiBase}/logs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, log_date: date, content })
    });

    // Handle response
    if (res.ok) {
      const savedLog = await res.json();
      logsMap[date] = savedLog; // Save the newly created log
      console.log('Log saved successfully:', savedLog);
      return savedLog;
    } else {
      const error = await res.json();
      console.error("Error saving log:", error.message);
      return null;
    }
  } catch (err) {
    console.error("Error while saving log:", err);
  }
};

const submitLog = async (date) => {
  if (!logsMap[date]) {
    console.error("No log found to submit for this date.");
    return;
  }

  try {
    const res = await fetch(`${apiBase}/logs/submit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, log_date: date })
    });

    if (res.ok) {
      const updatedLog = await res.json();
      logsMap[date] = updatedLog; // Update the log as submitted
      console.log("Log successfully submitted:", updatedLog);
    } else {
      const error = await res.json();
      console.error("Error submitting log:", error.message);
    }
  } catch (err) {
    console.error("Error while submitting log:", err);
  }
};

// Handle the click event on the calendar
document.querySelectorAll('.calendar-day').forEach(dayElement => {
  dayElement.addEventListener('click', async (event) => {
    const selectedDate = event.target.dataset.date; // Get the date of the clicked cell
    
    if (!selectedDate) {
      return;
    }

    // Check if the clicked date is in the future
    const currentDate = new Date();
    const clickedDate = new Date(selectedDate);
    
    if (clickedDate > currentDate) {
      alert('You cannot add logs for future dates.');
      return;
    }

    // If the date exists in logsMap, show the existing log for that day
    if (logsMap[selectedDate]) {
      document.getElementById('daily-log').querySelector('.log-body').innerHTML = logsMap[selectedDate].content;
    } else {
      document.getElementById('daily-log').querySelector('.log-body').innerHTML = 'You haven’t filled any log for today';
    }

    // Show the 'Add Log' modal
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex'; // Open the modal

    // Handle saving the log
    document.getElementById('sendFeedback').addEventListener('click', async () => {
      const content = document.getElementById('signatureText').value;
      
      // If there's no content, alert the user
      if (!content) {
        alert('Please enter a log.');
        return;
      }

      // Save the log
      const savedLog = await saveLog(selectedDate, content);

      // If log is saved successfully, show the confirmation modal
      if (savedLog) {
        const overlay2 = document.getElementById('overlay2');
        overlay2.style.display = 'flex'; // Show the confirmation modal

        document.getElementById('proceedBtn').addEventListener('click', async () => {
          await submitLog(selectedDate); // Submit the log after confirmation
          overlay2.style.display = 'none'; // Close confirmation modal
          overlay.style.display = 'none'; // Close the log input modal
          alert('Your log has been saved and submitted successfully!');
        });
      }
    });

    // Handle canceling the log creation
    document.getElementById('closeBtn').addEventListener('click', () => {
      overlay.style.display = 'none'; // Close the modal
    });
  });
});
