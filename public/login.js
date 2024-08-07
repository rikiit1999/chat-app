async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    // Validation
    if (!username || !password) {
        errorDiv.textContent = 'Username and password are required';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            
            alert('Login successful');
            window.location.href = 'message.html';
        } else {
            errorDiv.textContent = result.message || 'Login failed';
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        errorDiv.textContent = 'An error occurred';
    }
}