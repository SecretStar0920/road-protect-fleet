export const contractOcrConfig = {
    defaultTimeout: 180 * 1000, // 3 minutes
    ocrEndpoint: process.env.OCR_API_HOST || 'http://63.250.61.47:3000/contract/ocr',
};
