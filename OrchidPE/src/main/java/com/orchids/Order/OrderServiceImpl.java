package com.orchids.Order;

import com.orchids.dto.OrderDetailResponse;
import com.orchids.dto.OrderItemRequest;
import com.orchids.dto.OrderItemResponse;
import com.orchids.pojo.Order;
import com.orchids.pojo.OrderDetail;
import com.orchids.pojo.Account;
import com.orchids.Account.AccountRepository;
import com.orchids.Orchid.OrchidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {


    private final OrderRepository orderRepository;


    private final AccountRepository accountRepository;

    private final OrchidRepository orchidRepository;

    private final OrderDetailRepostiory orderDetailRepository;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : null;
    }

    private OrderDetailResponse toOrderDetailResponse(OrderDetail detail) {
        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(detail.getId());
        response.setProductId(detail.getOrchid() != null ? detail.getOrchid().getOrchidId() : null);
        response.setOrchidName(detail.getOrchid() != null ? detail.getOrchid().getOrchidName() : null);
        response.setOrchidUrl(detail.getOrchid() != null ? detail.getOrchid().getOrchidUrl() : null);
        response.setQuantity(detail.getQuantity());
        response.setPrice(detail.getPrice() != null ? detail.getPrice().doubleValue() : 0.0);
        return response;
    }

    private OrderItemResponse toResponse(Order order) {
        OrderItemResponse response = new OrderItemResponse();
        response.setOrchidId(order.getId());
        response.setOrderDate(order.getOrderDate());
        response.setOrderStatus(order.getOrderStatus());
        response.setPrice(order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0.0);
        if (order.getAccount() != null) {
            response.setAccountId(order.getAccount().getAccountId());
            response.setAccountUsername(order.getAccount().getAccountName());
        }
        if (order.getOrderDetails() != null) {
            List<OrderDetailResponse> detailResponses = order.getOrderDetails().stream()
                    .map(this::toOrderDetailResponse)
                    .collect(Collectors.toList());
            response.setOrderDetails(detailResponses);
        }
        return response;
    }

    private Order toEntity(OrderItemRequest request) {
        Order order = new Order();
        order.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : LocalDateTime.now());
        order.setOrderStatus(request.getOrderStatus() != null ? request.getOrderStatus() : "NEW");
        order.setTotalAmount(BigDecimal.valueOf(request.getPrice() * request.getQuantity()));
        if (request.getAccountId() != null) {
            Optional<Account> accountOpt = accountRepository.findById(request.getAccountId());
            accountOpt.ifPresent(order::setAccount);
        }
        // You can map order details from request if needed
        return order;
    }

    @Override
    @PreAuthorize("hasRole('ROLE_USER')")
    public OrderItemResponse createOrder(OrderItemRequest request) {
        if (request.getPrice() == null || request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Price and quantity must be provided and quantity > 0");
        }
        Account currentAccount = accountRepository.findByAccountName(getCurrentUsername());
        Order order = toEntity(request);
        order.setAccount(currentAccount);
        Order savedOrder = orderRepository.save(order);

        // Save OrderDetail for the purchased orchid
        if (request.getOrchidId() != null) {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(savedOrder);
            detail.setQuantity(request.getQuantity());
            detail.setPrice(BigDecimal.valueOf(request.getPrice()));
            orchidRepository.findById(request.getOrchidId()).ifPresent(detail::setOrchid);
            orderDetailRepository.save(detail);
        }

        return toResponse(savedOrder);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public OrderItemResponse getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
            .filter(order -> {
                // Admins can see all, users only their own
                String username = getCurrentUsername();
                if (username == null) return false;
                if (SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                    return true;
                }
                // For users, check if the order's account username matches
                return order.getAccount() != null && username.equals(order.getAccount().getAccountName());
            })
            .map(this::toResponse)
            .orElse(null);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<OrderItemResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public OrderItemResponse updateOrder(Long orderId, OrderItemRequest request) {
        return orderRepository.findById(orderId).map(order -> {
            order.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : order.getOrderDate());
            order.setOrderStatus(request.getOrderStatus() != null ? request.getOrderStatus() : order.getOrderStatus());
            order.setTotalAmount(BigDecimal.valueOf(request.getPrice() * request.getQuantity()));
            if (request.getAccountId() != null) {
                accountRepository.findById(request.getAccountId()).ifPresent(order::setAccount);
            }
            // Update order details if needed
            Order updated = orderRepository.save(order);
            return toResponse(updated);
        }).orElse(null);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    public List<OrderItemResponse> getOrdersForCurrentUser() {
        String username = getCurrentUsername();
        if (username == null) return List.of();
        return orderRepository.findAll().stream()
            .filter(order -> order.getAccount() != null && username.equals(order.getAccount().getAccountName()))
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}