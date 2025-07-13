package com.orchids.dto;

import lombok.Data;

@Data
public class OrderDetailRequest {
    private Long productId; // or orchidId, depending on your model
    private Integer quantity;
    private Double price;
}