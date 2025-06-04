import { loginuser } from "./auth.js";

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userData = await loginuser(email, password);

        switch (userData.role) {
            case 'Student':
                console.log("Login successful! Welcome Student:", userData);
                window.location.href = "dashboard.html";
                break;
            case 'Supervisor':
                console.log("Welcome Supervisor:", userData);
                window.location.href = "dashboard.html";
                break;
            case 'HR':
                console.log("Welcome HR:", userData);
                window.location.href = "dashboard.html";
                break;
            default:
                console.error("Unknown role:", userData.role);
                alert("Unknown role: " + userData.role);
                return; // Exit if the role is unknown
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message); // Display an error message to the user
    }
});