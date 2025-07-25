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
        alert("Login successful: " + response.data.message);

        if (response.status === 200) {
            const userData = response.data.user;
            const token = response.data.token;
            console.log("User data:", userData);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userId", userData.id); // Store user ID for later use

            if (!userData || !userData.role || !userData.id) {
                alert("User data is incomplete. Please try again.");
                console.error("Incomplete user data:", userData);
                return;
            }

            // Store user ID and other relevant info based on the user's role
            switch (userData.role?.toLowerCase()) {
                case 'student':
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("studentId", userData.id); // Store user ID for later use
                    window.location.href = "../user-view/studentCalendar.html";
                    break;
                case 'supervisor':
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("supervisorId", userData.id); // Store user ID for later use
                    window.location.href = "../supervisor-view/homeListView.html";
                    break;
                case 'admin':
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("adminId", userData.id); // Store user ID for later use
                    window.location.href = "../hr-view/hrDash.html";
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
