package com.orchids.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderItemResponse {
    private Long orchidId;
    private LocalDateTime orderDate;
    private String orderStatus;
    private Double price;
    private Long accountId;
    private String accountUsername;
    private List<OrderDetailResponse> orderDetails;
}