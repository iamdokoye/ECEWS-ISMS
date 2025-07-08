const studentId = localStorage.getItem('studentId'); // Ensure this is set during login
let logsMap = {};
const apiBase = window.APP_CONFIG.API_BASE;

const fetchStudentLogs = async () => {
  const res = await fetch(`${apiBase}/logs/${studentId}`);
  const logs = await res.json();
  logs.forEach(log => {
    logsMap[log.log_date] = log;
  });
};

const saveLog = async (date, content) => {
  const res = await fetch(`${apiBase}/logs/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, log_date: date, content })
  });
  return await res.json();
};

const submitLog = async (date) => {
  await fetch(`${apiBase}/logs/submit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, log_date: date })
  });
};
