document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const apiBase = window.API_BASE;
        const response = await axios.post(`${apiBase}/auth/login`, {
            email,
            password
        }, {
            withCredentials: true // Include credentials for cookie-based auth
        });
        console.log('Login response:', response.data);
        alert("Login successful! Redirecting...");

        if (response.status === 200) {
            const userData = response.data.user;
            const token = response.data.token;
            if (!token || typeof token !== 'string') {
                alert("Invalid token received. Please try again.");
                console.error("Invalid token:", token);
                return;
            }
            console.log("User data:", userData);

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.setItem("userId", userData.id); // Store user ID for later use

            if (!userData || !userData.role || !userData.id) {
                alert("User data is incomplete. Please try again.");
                console.error("Incomplete user data:", userData);
                return;
            }

            // Store user ID and other relevant info based on the user's role
            switch (userData.role?.toLowerCase()) {
                case 'student':
                    // sessionStorage.setItem("user", JSON.stringify(userData));
                    sessionStorage.setItem("studentId", userData.id); // Store user ID for later use)
                    window.location.href = "/frontend/user-view/studentCalendar.html";
                    break;
                case 'supervisor':
                    // sessionStorage.setItem("user", JSON.stringify(userData));
                    // sessionStorage.setItem("supervisorId", userData.id); // Store user ID for later use
                    window.location.href = "/frontend/supervisor-view/homeListView.html";
                    break;
                case 'admin':
                    // sessionStorage.setItem("user", JSON.stringify(userData));
                    // sessionStorage.setItem("adminId", userData.id); // Store user ID for later use
                    window.location.href = "/frontend/hr-view/hrDash.html";
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
