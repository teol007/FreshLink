package um.feri.ita.productsOffering;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import um.feri.ita.vao.Product;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProductsOfferingTest {
    private String expectedProductId;

    @Inject
    ProductsOffering products;

    @Inject
    EntityManager em;

    @AfterAll
    @Transactional
    public void deleteDataFromTables() {
        em.createQuery("DELETE FROM Product").executeUpdate();
    }

    @Test
    @Order(1)
    public void getAllZeroProducts() {
        List<Product> expected = Arrays.asList();
        assertEquals(expected, products.getAll());
    }

    @Test
    @Order(2)
    public void createProduct() {
        Product product = new Product("Bacon", "Very good bacon", 12.5, 49, "kg", "meat products", "678ccaf50fa65464fa76440d", "Bacon Paradise");

        Product addedProduct = products.add(product);
        assertNotEquals(null, product.getId());
        assertNotEquals("", product.getId());
        this.expectedProductId = product.getId();

        Product expected = new Product(this.expectedProductId,"Bacon", "Very good bacon", 12.5, 49, "kg", "meat products", "678ccaf50fa65464fa76440d", "Bacon Paradise");
        assertEquals(expected, addedProduct);
        assertEquals(List.of(expected), products.getAll());
    }

    @Test
    @Order(3)
    public void createProductThatAlreadyExists() {
        List expectedAllProducts = products.getAll();

        String existingId = this.expectedProductId;
        Product product = new Product();
        product.setId(existingId);

        Product addedProduct = products.add(product);
        assertEquals(null, addedProduct);
        assertEquals(expectedAllProducts, products.getAll());
    }

    @Test
    @Order(4)
    public void getProduct() {
        String id = this.expectedProductId;
        Product expected = new Product(id, "Bacon", "Very good bacon", 12.5, 49, "kg", "meat products", "678ccaf50fa65464fa76440d", "Bacon Paradise");

        assertEquals(expected, products.get(id));
        assertEquals(List.of(expected), products.getAll());
    }

    @Test
    @Order(5)
    public void getProductWithWrongId() {
        String wrongId = "Wrong id";
        List<Product> expectedAllProducts = products.getAll();

        assertEquals(null, products.get(wrongId));
        assertEquals(expectedAllProducts, products.getAll());
    }

    @Test
    @Order(6)
    public void updateProduct() {
        String id = this.expectedProductId;
        Product updatedProduct = new Product("Wrong id", "Bacon", "Very very good bacon", 15.5, 45, "kg", "meat products", "678ccaf50fa65464fa76440d", "Bacon Paradise");
        Product expected = new Product(id, "Bacon", "Very very good bacon", 15.5, 45, "kg", "meat products", "678ccaf50fa65464fa76440d", "Bacon Paradise");

        assertEquals(expected, products.update(id, updatedProduct));
        assertEquals(List.of(expected), products.getAll());
    }

    @Test
    @Order(7)
    public void updateProductWithWrongId() {
        String wrongId = "Wrong id";
        List<Product> expectedAllProducts = products.getAll();

        assertEquals(null, products.update(wrongId, new Product()));
        assertEquals(expectedAllProducts, products.getAll());
    }

    @Test
    @Order(8)
    public void deleteProduct() {
        String id = this.expectedProductId;
        assertEquals(true, products.delete(id));
        assertEquals(List.of(), products.getAll());
    }

    @Test
    @Order(9)
    public void deleteProductWithWrongId() {
        String wrongId = "Wrong id";
        List<Product> expectedAllProducts = products.getAll();

        assertEquals(false, products.delete(wrongId));
        assertEquals(expectedAllProducts, products.getAll());
    }

}
