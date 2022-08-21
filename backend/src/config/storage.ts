import * as path from 'path';

export const storageDirectory = (additionalPath: string = ''): string => {
    const root = process.env.STORAGE || '/app/storage';
    return path.join(root, additionalPath);
};

export const externalStorageDirectory = (additionalPath: string = ''): string => {
    const root = process.env.STORAGE_EXTERNAL;
    return path.join(root, additionalPath);
};
