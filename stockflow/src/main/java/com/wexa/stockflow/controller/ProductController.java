
package com.wexa.stockflow.controller;

import com.wexa.stockflow.dto.ProductRequest;
import com.wexa.stockflow.dto.ProductResponse;
import com.wexa.stockflow.entity.User;
import com.wexa.stockflow.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal User user) {

        return productService.createProduct(request, user);
    }

    @GetMapping
    public List<ProductResponse> getAllProducts(
            @AuthenticationPrincipal User user) {

        return productService.getAllProducts(user);
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        return productService.getProduct(id, user);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal User user) {

        return productService.updateProduct(id, request, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        productService.deleteProduct(id, user);
    }
}
