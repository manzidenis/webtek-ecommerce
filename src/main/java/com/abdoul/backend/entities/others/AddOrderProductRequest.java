package com.abdoul.backend.entities.others;

import java.util.UUID;

public class AddOrderProductRequest {
    private UUID productId;
    private int quantity;

    
    public AddOrderProductRequest(UUID productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
    
    public UUID getProductId() {
        return productId;
    }
    public void setProductId(UUID productId) {
        this.productId = productId;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    
}
