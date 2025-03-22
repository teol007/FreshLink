package um.feri.ita.dao;

import java.util.List;
import java.util.Optional;

public interface Dao<T> {
    List<T> getAll();
    Optional<T> get(String id);
    void save(T t);
    void update(String id, T t);
    boolean delete(String id);
}
