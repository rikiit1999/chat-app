async function sendMessage() {
    const sender = document.getElementById('sender').value;
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('message').value;

    try{
        console.log('Sending message:', { sender, recipient, message }); // Log data being sent

        const response = await fetch('http://localhost:3003/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, recipient, message })
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const result = await response.json();
        console.log('Message sent:', result);
        displayMessages(sender, recipient);
    }   catch (error) {
        console.error('Error:', error);
    }
}

async function displayMessages(sender, recipient) {
    try {
        const response = await fetch(`http://localhost:3003/messages/${sender}/${recipient}`);
        console.log('Display messages response status:', response.status); // Log response status

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Network response was not ok');
    }

    const messages = await response.json();
    const messagesDiv = document.getElementById('messages');
    
    messagesDiv.innerHTML = '';
    
    messages.forEach(msg => {
        messagesDiv.innerHTML += `<p><strong>${msg.sender}:</strong> ${msg.message}</p>`;
    });
    } catch(err) {
        console.error('Error:', error);
    }
}