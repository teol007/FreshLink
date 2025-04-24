import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import path from 'path';
import { productsOfferingBaseUrl } from '../../config';

const protoPath = path.join(__dirname, './productsOffering.proto');

const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const productsPackage = protoDescriptor.um.feri.ita.products;

export const productsClient = new productsPackage.ProductsOfferingService(
  productsOfferingBaseUrl,
  grpc.credentials.createInsecure()
);
