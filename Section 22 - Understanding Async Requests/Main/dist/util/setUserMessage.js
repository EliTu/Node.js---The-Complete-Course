"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Destructure the message from the flash array and pass it on to be used on the view as a simple string.
 * @param flash The 'connect-flash' package session flash message array that contains the message string.
 */
const setUserMessage = (flash) => {
    const [message] = flash;
    if (!message)
        return '';
    return message;
};
exports.default = setUserMessage;
//# sourceMappingURL=setUserMessage.js.map