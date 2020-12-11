const message = document.querySelector('.message');

const messageTimeout = setTimeout(() => {
	message.style.display = 'none';
}, 5000);

if (message) {
	messageTimeout();
}
