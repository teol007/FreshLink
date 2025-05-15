import dotenv from 'dotenv';
dotenv.config();

export const baseUrl = process.env.WBFF_BASE_URL;
if(!baseUrl)
  throw new Error("Envirmental variable WBFF_BASE_URL not set.");

export const manageUsersBaseUrl = process.env.WBFF_MANAGE_USERS_SERVICE_BASE_URL;
if(!manageUsersBaseUrl)
  throw new Error("Envirmental variable WBFF_MANAGE_USERS_SERVICE_BASE_URL not set.");

export const productsOfferingBaseUrl = process.env.WBFF_PRODUCTS_OFFERING_SERVICE_BASE_URL;
if(!productsOfferingBaseUrl)
  throw new Error("Envirmental variable WBFF_PRODUCTS_OFFERING_SERVICE_BASE_URL not set.");

export const orderProductsRestBaseUrl = process.env.WBFF_ORDER_PRODUCTS_SERVICE_REST_BASE_URL;
if(!orderProductsRestBaseUrl)
  throw new Error("Envirmental variable WBFF_ORDER_PRODUCTS_SERVICE_REST_BASE_URL not set.");

export const orderProductsMsQueueBaseUrl = process.env.WBFF_ORDER_PRODUCTS_SERVICE_MSQUEUE_URL;
if(!orderProductsMsQueueBaseUrl)
  throw new Error("Envirmental variable WBFF_ORDER_PRODUCTS_SERVICE_MSQUEUE_URL not set.");

export const orderProductsMsQueueName = process.env.WBFF_ORDER_PRODUCTS_SERVICE_MSQUEUE_NAME;
if(!orderProductsMsQueueName)
  throw new Error("Envirmental variable WBFF_ORDER_PRODUCTS_SERVICE_MSQUEUE_NAME not set.");

export const auditLogsMsQueueName = process.env.WBFF_AUDIT_LOG_MSQUEUE_NAME;
if(!auditLogsMsQueueName)
  throw new Error("Envirmental variable WBFF_AUDIT_LOG_MSQUEUE_NAME not set.");