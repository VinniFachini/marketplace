import { v4 as uuidv4 } from 'uuid'; // Import uuid v4
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const filePath = `./uploads/${uuidv4()}`;

interface DecodedImage {
    type: string;
    data: Buffer;
}

function decodeBase64Image(dataString: string): DecodedImage | Error {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response: Partial<DecodedImage> = {};

    if (!matches || matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response as DecodedImage;
}

export const handleImageUpload = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (req.body.image) {
            const imageBuffer = decodeBase64Image(req.body.image);
            
            if (imageBuffer instanceof Error) {
                throw imageBuffer;
            }

            const imageTypeDetected = imageBuffer.type.match(/\/(.*?)$/);
            
            if (imageTypeDetected) {
                const finalPath = `${filePath}.${imageTypeDetected[1]}`;
                
                req.body.imagePath = finalPath.replace('./uploads/', '');

                fs.writeFileSync(finalPath, imageBuffer.data);
            }
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};