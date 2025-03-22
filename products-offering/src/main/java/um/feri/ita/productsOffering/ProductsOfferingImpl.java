package um.feri.ita.productsOffering;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import um.feri.ita.dao.ProductsDao;
import um.feri.ita.vao.Product;

import java.util.List;

@ApplicationScoped
public class ProductsOfferingImpl implements ProductsOffering {
    @Inject
    private ProductsDao dao;

    @Override
    public List<Product> getAll() {
        return dao.getAll();
    }

    @Override
    public Product get(String id) {
        if(id == null)
            return null;

        return dao.get(id).orElse(null); // If product does not exist return null
    }

    @Override
    public Product add(Product product) {
        if(product == null)
            return null;

        if(this.get(product.getId()) != null)
            return null;

        dao.save(product);
        return this.get(product.getId());
    }

    @Override
    public Product update(String id, Product updatedProduct) {
        if(id==null || updatedProduct==null)
            return null;

        try {
            dao.update(id, updatedProduct);
            return this.get(id);
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    @Override
    public boolean delete(String id) {
        if(id == null)
            return false;

        return dao.delete(id);
    }
}
