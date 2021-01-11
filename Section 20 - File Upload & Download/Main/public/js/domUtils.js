/**
 * a simple util to find and hide the popout success or error message in the UI after 8 seconds.
 */
const message = document.querySelector('.message');
if (message) {
	setTimeout(() => {
		message.style.display = 'none';
	}, 8000);
}

/**
 *  a util to set the file picker input label text value when picking a file with the input.
 * */
const filePicker = document.querySelector('.file-picker-input');
if (filePicker) {
	filePicker.onchange = () => {
		if (filePicker.files.length > 0) {
			const fileName = filePicker.files[0].name;
			document.querySelector('.file-name').textContent = fileName;
		}
	};
}
