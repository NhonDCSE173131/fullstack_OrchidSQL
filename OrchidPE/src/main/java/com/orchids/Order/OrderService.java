package com.orchids.Order;

import com.orchids.dto.OrderItemResponse;
import com.orchids.dto.OrderItemRequest;
import java.util.List;

public interface OrderService {
    OrderItemResponse createOrder(OrderItemRequest request);
    OrderItemResponse getOrderById(Long orderId);
    List<OrderItemResponse> getAllOrders();
    void deleteOrder(Long orderId);
    OrderItemResponse updateOrder(Long orderId, OrderItemRequest request);
    List<OrderItemResponse> getOrdersForCurrentUser();
}