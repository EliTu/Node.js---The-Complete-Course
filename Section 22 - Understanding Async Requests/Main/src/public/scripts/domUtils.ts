// Queries
const message: HTMLElement = document.querySelector('.message');
const filePicker: HTMLInputElement = document.querySelector(
	'.file-picker-input'
);
const deleteButton: HTMLElement = document.querySelector(
	'#product-delete-button'
);
const fileNameLabel: HTMLElement = document.querySelector('.file-name');

/**
 * a simple util to find and hide the popout success or error message in the UI after 8 seconds.
 */
if (message) {
	setTimeout(() => {
		message.style.display = 'none';
	}, 8000);
}

/**
 *  a util to set the file picker input label text value when picking a file with the input.
 * */
if (filePicker) {
	filePicker.onchange = () => {
		if (filePicker.files.length > 0) {
			const { name } = filePicker.files[0];
			fileNameLabel.textContent = name;
		}
	};
}

/**
 * an async util function to make an async request to delete a product from the admin products list.
 * @param {*} btn The button input that was clicked, accessed via the native onclick function.
 */
const deleteProduct = async (btn: HTMLButtonElement) => {
	// access the clicked button element parent first
	const buttonParent = btn.parentNode;

	// get the data hidden inputs
	const hiddenInputs: NodeListOf<HTMLInputElement> = buttonParent.querySelectorAll(
		'[type="hidden"]'
	);
	const inputValues: Record<string, string> = {};

	// create a mapped object of the values by input name
	for (const { name, value } of hiddenInputs) {
		inputValues[name] = value;
	}

	if (Object.keys(inputValues).length) {
		const { deletedProductId: productId, _csrf } = inputValues;

		try {
			const response = await fetch(`/admin/product/${productId}`, {
				method: 'DELETE',
				headers: {
					// the csurf package will not only check request bodies for csrf tokens, but also headers
					'csrf-token': _csrf,
				},
			});
			const deleteResBody = await response.json();
			console.log(deleteResBody);

			if (response.status === 200) {
				const productElementNode = btn.closest('article');
				if (productElementNode) productElementNode.remove();
			}
		} catch (error: any) {
			console.error(error);
		}
	}
};
