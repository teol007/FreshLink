package um.feri.ita.vao;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private double quantity;
    private String unit;
    private String category;
    private String farmerId;
    private String farmerName;

    public Product() {}

    public Product(String id, String name, String description, double price, double quantity, String unit, String category, String farmerId, String farmerName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
    }

    public Product(String name, String description, double price, double quantity, String unit, String category, String farmerId, String farmerName) {
        this(null, name, description, price, quantity, unit, category, farmerId, farmerName);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        return Double.compare(product.price, price) == 0 && Double.compare(product.quantity, quantity) == 0 && Objects.equals(id, product.id) && Objects.equals(name, product.name) && Objects.equals(description, product.description) && Objects.equals(unit, product.unit) && Objects.equals(category, product.category) && Objects.equals(farmerId, product.farmerId) && Objects.equals(farmerName, product.farmerName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, price, quantity, unit, category, farmerId, farmerName);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", category='" + category + '\'' +
                ", farmerId='" + farmerId + '\'' +
                ", farmerName='" + farmerName + '\'' +
                '}';
    }
}
