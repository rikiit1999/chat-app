const axios = require('axios');

const botToken = '7000165352:AAGZhWEzFMCSbLLNW-uKPjx0S0BptCzMI9A'; // Replace with your bot token

async function getGroupChatId() {
    const url = `https://api.telegram.org/bot${botToken}/getUpdates`;

    try {
        const response = await axios.get(url);
        const result = response.data;

        if (result.ok) {
            const messages = result.result;
            if (messages.length > 0) {
                const groupMessages = messages.filter(update => update.message && update.message.chat.type === 'group' || update.message.chat.type === 'supergroup');
                if (groupMessages.length > 0) {
                    const chatId = groupMessages[0].message.chat.id;
                    console.log('Group Chat ID:', chatId);
                    return chatId;
                } else {
                    console.log('No group messages found. Ensure you have sent a message in the group.');
                }
            } else {
                console.log('No messages found. Send a message to the group first.');
            }
        } else {
            console.error('Failed to get updates:', result.description);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
}

getGroupChatId();
