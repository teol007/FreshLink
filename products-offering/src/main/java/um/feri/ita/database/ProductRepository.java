package um.feri.ita.database;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import um.feri.ita.vao.Product;

@ApplicationScoped
public class ProductRepository implements PanacheRepositoryBase<Product, String> {

}