const { Message, User, Admin } = require('./models/Message');

// Track online admins
let onlineAdmins = [];

// Update online admins list
async function updateOnlineAdmins() {
    try {
        const admins = await Admin.find({ online: true });
        onlineAdmins = admins.map(admin => admin.username);
    } catch (error) {
        console.error('Error updating online admins:', error);
    }
}

// Periodically update the list of online admins
updateOnlineAdmins();
setInterval(updateOnlineAdmins, 60000); // Update every minute

// Route messages to an available admin
async function routeMessageToAdmin(sender, messageContent) {
    if (onlineAdmins.length === 0) {
        throw new Error('No admins available');
    }

    // Round-robin approach to select an admin
    const recipient = onlineAdmins.shift(); // Get the first admin in the list
    onlineAdmins.push(recipient); // Add them back to the end of the list

    const newMessage = new Message({ sender, recipient, message: messageContent });
    await newMessage.save();
    return newMessage;
}

module.exports = { routeMessageToAdmin };