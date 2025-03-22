package um.feri.ita.api;

import grpc.*;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import um.feri.ita.productsOffering.ProductsOffering;

import java.util.ArrayList;
import java.util.List;

import org.jboss.logging.Logger;

@io.quarkus.grpc.GrpcService
@Blocking
public class GrpcService implements ProductsOfferingService {
    private static final Logger logger = Logger.getLogger(GrpcService.class);

    @Inject
    ProductsOffering productsOffering;

    private Product convertToGrpcProduct(um.feri.ita.vao.Product vaoProduct) {
        if(vaoProduct == null)
            return null;

        return Product.newBuilder()
                .setId(vaoProduct.getId())
                .setName(vaoProduct.getName())
                .setDescription(vaoProduct.getDescription())
                .setPrice(vaoProduct.getPrice())
                .setQuantity(vaoProduct.getQuantity())
                .setUnit(vaoProduct.getUnit())
                .setCategory(vaoProduct.getCategory())
                .setFarmerId(vaoProduct.getFarmerId())
                .setFarmerName(vaoProduct.getFarmerName())
                .build();
    }

    private um.feri.ita.vao.Product convertFromGrpcProduct(Product grpcProduct) {
        return new um.feri.ita.vao.Product(grpcProduct.getId(), grpcProduct.getName(), grpcProduct.getDescription(), grpcProduct.getPrice(), grpcProduct.getQuantity(), grpcProduct.getUnit(), grpcProduct.getCategory(), grpcProduct.getFarmerId(), grpcProduct.getFarmerName());
    }

    private Uni createProductNotFoundGrpcException(String id) {
        return Uni.createFrom().failure(new StatusRuntimeException(Status.NOT_FOUND.withDescription("Product with id '" + id + "' not found.")));
    }

    @Override
    public Uni<ProductList> getAllProducts(Empty emptyMessage) {
        logger.info("gRPC 'getAllProducts' method called");
        List<Product> allGrpcProducts = new ArrayList<>();

        for(um.feri.ita.vao.Product vaoP : productsOffering.getAll())
            allGrpcProducts.add(convertToGrpcProduct(vaoP));

        ProductList productList = ProductList.newBuilder().addAllProducts(allGrpcProducts).build();
        return Uni.createFrom().item(productList);
    }

    @Override
    public Uni<Product> getProduct(ProductId request) {
        logger.info("gRPC 'getProduct' method called");

        um.feri.ita.vao.Product productVao = productsOffering.get(request.getId());
        if(productVao == null)
            return createProductNotFoundGrpcException(request.getId());

        Product productGrpc = convertToGrpcProduct(productVao);
        return Uni.createFrom().item(productGrpc);
    }

    @Override
    public Uni<Product> addProduct(Product request) {
        logger.info("gRPC 'addProduct' method called");

        um.feri.ita.vao.Product addedProductVao = productsOffering.add(convertFromGrpcProduct(request));
        if(addedProductVao == null)
            return Uni.createFrom().failure(new StatusRuntimeException(Status.ALREADY_EXISTS.withDescription("Product with id '" + request.getId() + "' already exists.")));

        Product product = convertToGrpcProduct(addedProductVao);
        return Uni.createFrom().item(product);
    }

    @Override
    public Uni<Product> updateProduct(Product request) {
        logger.info("gRPC 'updateProduct' method called");

        String id = request.getId();
        um.feri.ita.vao.Product updatedProductVao = productsOffering.update(id, convertFromGrpcProduct(request));

        if(updatedProductVao == null)
            return createProductNotFoundGrpcException(request.getId());

        Product product = convertToGrpcProduct(updatedProductVao);
        return Uni.createFrom().item(product);
    }

    @Override
    public Uni<Empty> deleteProduct(ProductId request) {
        logger.info("gRPC 'deleteProduct' method called");

        boolean isDeleted = productsOffering.delete(request.getId());
        if(!isDeleted)
            return createProductNotFoundGrpcException(request.getId());

        return Uni.createFrom().item(Empty.getDefaultInstance());
    }
}
