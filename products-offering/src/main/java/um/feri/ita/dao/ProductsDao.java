package um.feri.ita.dao;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import um.feri.ita.database.ProductRepository;
import um.feri.ita.vao.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Singleton
public class ProductsDao implements Dao<Product> {
    @Inject
    ProductRepository db;

    @Override
    public List<Product> getAll() {
        return db.listAll();
    }

    @Override
    public Optional<Product> get(String id) {
        return db.findByIdOptional(id);
    }

    @Override
    @Transactional
    public void save(Product product) {
        if(product.getId()==null || product.getId().equals(""))
            product.setId(UUID.randomUUID().toString());

        db.persist(product);
    }

    @Override
    @Transactional
    public void update(String id, Product updatedProduct) throws EntityNotFoundException {
        Product existingProduct = db.findById(id);
        if (existingProduct == null)
            throw new EntityNotFoundException("Product with id '" + id + "' not found.");

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setUnit(updatedProduct.getUnit());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setFarmerId(updatedProduct.getFarmerId());
        existingProduct.setFarmerName(updatedProduct.getFarmerName());

        db.flush();
    }

    @Override
    @Transactional
    public boolean delete(String id) {
        return db.deleteById(id);
    }
}
