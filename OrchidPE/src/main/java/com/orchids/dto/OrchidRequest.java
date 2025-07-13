package com.orchids.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class OrchidRequest {
    @NotBlank(message = "Orchid name must not be blank")
    @Size(max = 100, message = "Orchid name must not exceed 100 characters")
    private String orchidName;

    @NotBlank(message = "Orchid description must not be blank")
    @Size(max = 500, message = "Orchid description must not exceed 500 characters")
    private String orchidDescription;

    @NotNull(message = "Orchid image file is required")
    private MultipartFile orchidUrl;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "isNatural must not be null")
    private Boolean isNatural;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}