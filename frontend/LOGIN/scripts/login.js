document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await axios.post("http://localhost:5000/auth/login", {
            email,
            password
        });
        console.log(response.data);
        if (response.status === 200) {
            const userData = response.data;

            switch (userData.role) {
                case 'Student':
                    window.location.href = "dashboard.html";
                    break;
                case 'Supervisor':
                    window.location.href = "../Supervisor VIEW/homeListView.html";
                    break;
                case 'Admin':
                    window.location.href = "../HR VIEW/hrDash.html";
                    break;
                case 'Staff':
                    window.location.href = "../Staff VIEW/homeGrid.html";
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
        document.getElementById("error").textContent = error.message;
        console.error("Login failed: " + error.message);
    }
});