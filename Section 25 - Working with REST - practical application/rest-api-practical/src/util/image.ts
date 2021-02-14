export const generateBase64FromImage = (imageFile: Blob) => {
	const reader = new FileReader();
	const promise = new Promise((resolve, reject) => {
		reader.onload = (e: ProgressEvent<FileReader>) =>
			resolve(e?.target?.result);
		reader.onerror = (err) => reject(err);
	});

	reader.readAsDataURL(imageFile);
	return promise;
};
