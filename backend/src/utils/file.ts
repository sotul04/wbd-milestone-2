import fs from 'fs';
import path from 'path';

export const deleteFile = async (filename: string) => {
    try {
        const filePath = path.join(__dirname, '../../storage', filename);

        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log(`File ${filename} successfully deleted.`);
        } else {
            console.log(`File ${filename} not found.`);
        }
    } catch (error) {
        console.error(`Error deleting file ${filename}:`, error);
        if (error instanceof Error) {
            throw new Error(`Could not delete file: ${error.message}`);
        }
        throw error;
    }
}

export const createImageFile = async (
    fileName: string,
    fileBuffer: Buffer
) => {
    try {
        const filePath = path.join(__dirname, '../../storage', fileName);
        await fs.promises.writeFile(filePath, fileBuffer);
        console.log(`Image file ${fileName} successfully created.`);
    } catch (error) {
        console.error(`Error creating image file ${fileName}:`, error);
        if (error instanceof Error) {
            throw new Error(`Could not create image file: ${error.message}`);
        }
        throw error;
    }
};