async function sendMessage() {
    const sender = document.getElementById('sender').value;
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('message').value;

    const response = await fetch('http://localhost:3003/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, recipient, message })
    });

    const result = await response.json();
    displayMessages(sender, recipient);
}

async function displayMessages(sender, recipient) {
    const response = await fetch(`http://localhost:3003/messages/${sender}/${recipient}`);
    const messages = await response.json();
    
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    
    messages.forEach(msg => {
        messagesDiv.innerHTML += `<p><strong>${msg.sender}:</strong> ${msg.message}</p>`;
    });
}