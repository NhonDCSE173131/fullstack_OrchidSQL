package com.orchids.dto;

import lombok.Data;

@Data
public class OrderDetailRequest {
    private Long productId; // or orchidId, depending on your model
    private int quantity;
    private Double price;
}