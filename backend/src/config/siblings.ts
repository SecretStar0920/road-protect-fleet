export const siblings = {
    'document-api': {
        name: 'document-api',
        url: process.env.DOCUMENT_API_URL || 'http://document-api:8080',
    },
    'document-renderer': {
        name: 'document-renderer',
        url: process.env.DOCUMENT_RENDERED_URL || 'http://document-renderer:4300',
    },
    'default-crawler-api': {
        name: 'default-crawler-api',
        url: process.env.CRAWLER_API_URL || 'http://crawler-api:3000',
    },
    'jerusalem-crawler-api': {
        name: 'jerusalem-crawler-api',
        url: process.env.JERUSALEM_CRAWLER_API_URL || 'http://crawler-api:3000',
    },
};
