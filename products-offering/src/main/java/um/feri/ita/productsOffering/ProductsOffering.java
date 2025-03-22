package um.feri.ita.productsOffering;

import um.feri.ita.vao.Product;

import java.util.List;

public interface ProductsOffering {
    List<Product> getAll();
    Product get(String id);
    Product add(Product product);
    Product update(String id, Product updatedProduct);
    boolean delete(String id);
}
