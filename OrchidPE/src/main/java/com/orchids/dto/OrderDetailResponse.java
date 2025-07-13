package com.orchids.dto;

import lombok.Data;

@Data
public class OrderDetailResponse {
    private Long id;
    private Long productId; // or orchidId, depending on your model
    private String orchidName;
    private String orchidUrl;
    private Integer quantity;
    private Double price;
}