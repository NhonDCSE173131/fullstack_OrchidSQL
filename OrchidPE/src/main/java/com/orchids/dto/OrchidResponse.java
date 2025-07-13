package com.orchids.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrchidResponse {
    private Long orchidId;
    private String orchidName;
    private String orchidDescription;
    private String orchidUrl;
    private BigDecimal price;
    private Boolean isNatural;
    private Long categoryId;
}