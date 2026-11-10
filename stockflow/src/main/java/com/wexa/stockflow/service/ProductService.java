
package com.wexa.stockflow.service;

import com.wexa.stockflow.dto.ProductRequest;
import com.wexa.stockflow.dto.ProductResponse;
import com.wexa.stockflow.entity.Product;
import com.wexa.stockflow.entity.User;
import com.wexa.stockflow.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public ProductResponse createProduct(
            ProductRequest request, User user) {

        Long organizationId = user.getOrganization().getId();

        if (productRepository.existsByOrganization_IdAndSku(
                organizationId, request.sku())) {

            throw new IllegalArgumentException(
                    "SKU already exists in your organization");
        }

        Product product = new Product();
        product.setOrganization(user.getOrganization());

        mapRequestToProduct(request, product);

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(User user) {

        return productRepository
                .findAllByOrganization_Id(
                        user.getOrganization().getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id, User user) {

        Product product = findProduct(id, user);

        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(
            Long id, ProductRequest request, User user) {

        Product product = findProduct(id, user);

        Long organizationId = user.getOrganization().getId();

        if (productRepository.existsByOrganization_IdAndSkuAndIdNot(
                organizationId, request.sku(), id)) {

            throw new IllegalArgumentException(
                    "SKU already exists in your organization");
        }

        mapRequestToProduct(request, product);

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id, User user) {

        Product product = findProduct(id, user);

        productRepository.delete(product);
    }

    private Product findProduct(Long id, User user) {

        return productRepository
                .findByIdAndOrganization_Id(
                        id, user.getOrganization().getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found"));
    }

    private void mapRequestToProduct(
            ProductRequest request, Product product) {

        product.setName(request.name());
        product.setSku(request.sku());
        product.setDescription(request.description());
        product.setQuantity(request.quantity());
        product.setCostPrice(request.costPrice());
        product.setSellingPrice(request.sellingPrice());
        product.setLowStockThreshold(
                request.lowStockThreshold());
    }

    private ProductResponse mapToResponse(Product product) {

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getDescription(),
                product.getQuantity(),
                product.getCostPrice(),
                product.getSellingPrice(),
                product.getLowStockThreshold(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
