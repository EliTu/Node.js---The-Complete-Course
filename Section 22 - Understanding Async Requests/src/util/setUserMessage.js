/**
 * Destructure the message from the flash array and pass it on to be used on the view as a simple string.
 * @param flash The 'connect-flash' package session flash object that contains the message string.
 */
const setUserMessage = (flash) => {
	const [message] = flash;

	if (!message) return '';

	return message;
};

module.exports = setUserMessage;
