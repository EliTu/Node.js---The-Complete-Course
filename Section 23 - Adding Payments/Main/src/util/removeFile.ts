import fs from 'fs';

/**
 * a simple util function to remove a file based on the file path.
 * @param filePath the path url to the file in the file system as saved on the DB.
 */
const removeFile = (filePath: string) => {
	fs.unlink(filePath, (error) => {
		if (error) throw error;
	});
};

export default removeFile;
