document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('loginForm not found!');
        return;
    }
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

    try {
        const response = await axios.post("http://localhost:5000/auth/login", {
            email,
            password
        });
        alert(response.data.message); 
        console.log(response.data);
        if (response.status === 200) {
            const role = userData.user.role;

            switch (role) {
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
        alert(error.response.data.message);
        console.error("Login failed: " + error.message);
    }
});
});