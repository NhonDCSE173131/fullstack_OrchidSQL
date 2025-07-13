package com.orchids.Order;

import com.orchids.pojo.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Additional query methods can be defined here if needed

    @EntityGraph(attributePaths = {"orderDetails", "orderDetails.orchid"})
    Optional<Order> findById(Long id);

    @EntityGraph(attributePaths = {"orderDetails", "orderDetails.orchid"})
    List<Order> findAll();
}
