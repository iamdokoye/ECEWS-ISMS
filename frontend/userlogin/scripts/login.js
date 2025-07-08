document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    

    try {
        const apiBase = window.APP_CONFIG.API_BASE;
        const response = await axios.post(`${apiBase}/auth/login`, {
            email,
            password
        });
        console.log(response.data);
        if (response.status === 200) {
            const userData = response.data.user;

            switch (userData.role?.toLowerCase()) {
                case 'student':
                    window.location.href = "../user-view/studentCalendar.html";
                    break;
                case 'supervisor':
                    window.location.href = "../supervisor-view/homeListView.html";
                    break;
                case 'admin':
                    window.location.href = "../hr-view/hrDash.html";
                    break;
                case 'staff':
                    window.location.href = "../staff-view/homeGrid.html";
                    break;
                default:
                    alert("Unknown role: " + userData.role);
            }
            console.log("Login successful:", response.data);
        } else {
            console.error("Login failed with status:", response.status);
            alert("Login failed: " + response.statusText);
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
});
