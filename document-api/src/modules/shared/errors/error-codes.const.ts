export const ERROR_CODES: { [key: string]: { message: (context?: object) => string; code: string } } = {
    E013_CouldNotMergeFile: { message: (context: { fileName: string }) => `E013: Could not merge ${context.fileName}`, code: `E013` },
};
