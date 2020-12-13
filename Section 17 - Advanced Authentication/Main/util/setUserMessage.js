const setUserMessage = (flash) => {
    const [message] = flash;
    
	if (!message) return '';

	return message;
};

module.exports = setUserMessage;
