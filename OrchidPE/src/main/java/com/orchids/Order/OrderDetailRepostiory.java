package com.orchids.Order;

import com.orchids.pojo.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepostiory extends JpaRepository<OrderDetail, Long> {
    void deleteAllByOrder_Id(Long orderId);
}
