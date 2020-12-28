/* a simple util to find and hide the popout success or error message in the UI after 8 seconds*/
const message = document.querySelector('.message');

const messageTimeout = setTimeout(() => {
	message.style.display = 'none';
}, 8000);

if (message) {
	messageTimeout();
}
