import { strapi } from "@strapi/client";

interface Logger {
  start: (message: string) => void;
  success: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, error: any) => void;
}

const nilLogger: Logger = {
  start: () => {},
  success: () => {},
  error: () => {},
};

function CollectionMgrFactory(collectionName: string, log: Logger = nilLogger) {
  try {
    log.start(`(${collectionName} CollectionMgrFactory) Creating Client`);
    const client = strapi({
      baseURL: process.env.STRAPI_CMS_API_URL + "/api" || "",
      auth: process.env.STRAPI_CMS_API_TOKEN || "",
    }).collection(collectionName);
    log.success(
      `(${collectionName} CollectionMgrFactory) Client created successfully`
    );
    return client;
  } catch (error) {
    log.error(
      `(${collectionName} CollectionMgrFactory) Failed to create collection manager:`,
      error
    );
    throw error;
  }
}

export default CollectionMgrFactory;
