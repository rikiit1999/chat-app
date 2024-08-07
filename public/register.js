async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    // Simple validation
    if (!username || !password) {
        errorDiv.textContent = 'Username and password are required';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful');
            window.location.href = 'index.html'; // Redirect to login page or another page
        } else {
            errorDiv.textContent = result.message || 'Registration failed';
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        errorDiv.textContent = 'An error occurred';
    }
}