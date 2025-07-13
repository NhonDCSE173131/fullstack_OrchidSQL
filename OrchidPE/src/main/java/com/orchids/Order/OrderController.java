package com.orchids.Order;

import com.orchids.dto.OrderItemRequest;
import com.orchids.dto.OrderItemResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/orders", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @Operation(
        summary = "Get all orders",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved orders")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @GetMapping
    public ResponseEntity<List<OrderItemResponse>> getAllOrders() {
        List<OrderItemResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @Operation(
        summary = "Get order by ID",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved order")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @GetMapping("/{id}")
    public ResponseEntity<OrderItemResponse> getOrderById(@PathVariable Long id) {
        OrderItemResponse order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Create a new order",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "201", description = "Order created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrderItemResponse> createOrder(@RequestBody OrderItemRequest request) {
        OrderItemResponse created = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
        summary = "Update an existing order",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Order updated successfully")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrderItemResponse> updateOrder(@PathVariable Long id, @RequestBody OrderItemRequest request) {
        OrderItemResponse updated = orderService.updateOrder(id, request);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Delete an order",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "204", description = "Order deleted successfully")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Get current user's orders",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's orders")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @GetMapping("/my")
    public ResponseEntity<List<OrderItemResponse>> getMyOrders() {
        List<OrderItemResponse> orders = orderService.getOrdersForCurrentUser();
        return ResponseEntity.ok(orders);
    }
}