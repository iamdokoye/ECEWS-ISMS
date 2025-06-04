export async function loginuser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        return data; // Return the user data or token
        localStorage.setItem('token', data.token); // Store the token in localStorage
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Propagate the error to be handled by the caller
    }
    
}