async function sendMessage() {
    const message = document.getElementById('message').value;
    const errorDiv = document.getElementById('error');

    // Simple validation
    if (!message) {
        errorDiv.textContent = 'Message cannot be empty';
        return;
    }

    const botToken = '7000165352:AAGZhWEzFMCSbLLNW-uKPjx0S0BptCzMI9A'; // RIKI_BOT
    //const chatId = '7098096854'; // Replace with group chat ID
    //const chatId = '-1002229716632'; // Replace with group chat ID
    const chatId = '-1002229716632';

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Message sent successfully');
            document.getElementById('message').value = ''; // Clear the textarea
        } else {
            errorDiv.textContent = result.description || 'Failed to send message';
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        errorDiv.textContent = 'An error occurred while sending the message';
    }
}