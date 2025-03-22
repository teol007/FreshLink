package um.feri.ita.api;

import grpc.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class GrpcServiceWithBlockingStubTest {
    private ManagedChannel channel;
    private String productId;

    @Inject
    EntityManager em;

    @AfterAll
    @Transactional
    public void deleteDataFromTables() {
        em.createQuery("DELETE FROM Product").executeUpdate();
    }

    @BeforeEach
    public void init() {
        channel = ManagedChannelBuilder.forAddress("localhost", 9001).usePlaintext().build();
    }

    @AfterEach
    public void cleanup() throws InterruptedException {
        channel.shutdown();
        channel.awaitTermination(10, TimeUnit.SECONDS);
    }

    @Test
    @Order(1)
    public void getAllProducts() {
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        ProductList reply = client.getAllProducts(Empty.getDefaultInstance());
        assertThat(reply.getProductsList()).isEqualTo(List.of());
    }

    @Test
    @Order(2)
    public void addProduct() {
        Product.Builder productBuilder = Product.newBuilder().setId("abc123").setName("Pork meat").setDescription("Tasty pork").setPrice(35.2).setQuantity(4).setUnit("kg").setCategory("meat products").setFarmerId("268okaf50fa65400fa76654z").setFarmerName("John's farm");

        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);
        Product reply = client.addProduct(productBuilder.build());

        assertThat(reply.getId()).isNotNull();
        assertThat(reply.getId()).isNotEqualTo("");
        this.productId = reply.getId();

        Product expected = productBuilder.setId(this.productId).build();
        assertThat(reply).isEqualTo(expected);
    }

    @Test
    @Order(3)
    public void addProductThatAlreadyExists() {
        boolean assertsWereTested = false;

        String existingId = this.productId;
        Product.Builder productBuilder = Product.newBuilder().setId(existingId);

        try {
            ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);
            Product reply = client.addProduct(productBuilder.build());
        } catch (StatusRuntimeException e) {
            assertThat(e.getStatus().getCode()).isEqualTo(Status.ALREADY_EXISTS.getCode());
            assertThat(e.getStatus().getDescription()).isEqualTo("Product with id '" + existingId + "' already exists.");
            assertsWereTested = true;
        }

        assertThat(assertsWereTested).isTrue();
    }

    @Test
    @Order(4)
    public void getProduct() {
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        String id = this.productId;
        ProductId productId = ProductId.newBuilder().setId(id).build();

        Product expected = Product.newBuilder().setId(id).setName("Pork meat").setDescription("Tasty pork").setPrice(35.2).setQuantity(4).setUnit("kg").setCategory("meat products").setFarmerId("268okaf50fa65400fa76654z").setFarmerName("John's farm").build();
        Product reply = client.getProduct(productId);
        assertThat(reply).isEqualTo(expected);
    }

    @Test
    @Order(5)
    public void getProductWithWrongId() {
        boolean assertsWereTested = false;
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        String wrongId = "Wrong id";
        ProductId wrongProductId = ProductId.newBuilder().setId(wrongId).build();

        try {
            Product reply = client.getProduct(wrongProductId);
        } catch (StatusRuntimeException e) {
            assertThat(e.getStatus().getCode()).isEqualTo(Status.NOT_FOUND.getCode());
            assertThat(e.getStatus().getDescription()).isEqualTo("Product with id '" + wrongId + "' not found.");
            assertsWereTested = true;
        }

        assertThat(assertsWereTested).isTrue();
    }

    @Test
    @Order(6)
    public void updateProduct() {
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        String id = this.productId;
        Product.Builder updatedProductBuilder = Product.newBuilder().setId(id).setName("Pork meat").setDescription("Very tasty pork").setPrice(40.2).setQuantity(5).setUnit("kg").setCategory("meat products").setFarmerId("268okaf50fa65400fa76654z").setFarmerName("John's farm");
        Product reply = client.updateProduct(updatedProductBuilder.build());

        Product expected = updatedProductBuilder.build();
        assertThat(reply).isEqualTo(expected);
    }

    @Test
    @Order(7)
    public void updateProductWithWrongId() {
        boolean assertsWereTested = false;
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        String wrongId = "Wrong id";
        Product.Builder productBuilder = Product.newBuilder().setId(wrongId);

        try {
            Product reply = client.updateProduct(productBuilder.build());
        } catch (StatusRuntimeException e) {
            assertThat(e.getStatus().getCode()).isEqualTo(Status.NOT_FOUND.getCode());
            assertThat(e.getStatus().getDescription()).isEqualTo("Product with id '" + wrongId + "' not found.");
            assertsWereTested = true;
        }

        assertThat(assertsWereTested).isTrue();
    }

    @Test
    @Order(8)
    public void deleteProduct() {
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        String id = this.productId;
        ProductId productId = ProductId.newBuilder().setId(id).build();
        Empty reply = client.deleteProduct(productId);

        assertThat(reply).isEqualTo(Empty.getDefaultInstance());
    }

    @Test
    @Order(9)
    public void deleteProductWithWrongId() {
        boolean assertsWereTested = false;
        ProductsOfferingServiceGrpc.ProductsOfferingServiceBlockingStub client = ProductsOfferingServiceGrpc.newBlockingStub(channel);

        String wrongId = "Wrong id";
        ProductId wrongProductId = ProductId.newBuilder().setId(wrongId).build();

        try {
            Empty reply = client.deleteProduct(wrongProductId);
        } catch (StatusRuntimeException e) {
            assertThat(e.getStatus().getCode()).isEqualTo(Status.NOT_FOUND.getCode());
            assertThat(e.getStatus().getDescription()).isEqualTo("Product with id '" + wrongId + "' not found.");
            assertsWereTested = true;
        }

        assertThat(assertsWereTested).isTrue();
    }

    /*
    // Could also test non-blocking calls (not needed)
    @Test
    public void getAllProductsMutinyStub() {
        MutinyProductsOfferingServiceGrpc.MutinyProductsOfferingServiceStub client = MutinyProductsOfferingServiceGrpc.newMutinyStub(channel);
        Uni nonBlockingReply = client.getAllProducts(Empty.getDefaultInstance());
        Object reply = nonBlockingReply.await().atMost(Duration.ofSeconds(5));
        assertThat(reply).isEqualTo(List.of());
    }
     */
}
