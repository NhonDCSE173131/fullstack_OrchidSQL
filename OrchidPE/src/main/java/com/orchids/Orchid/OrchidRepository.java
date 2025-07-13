package com.orchids.Orchid;

import com.orchids.pojo.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrchidRepository extends JpaRepository<Orchid, Long> {
    List<Orchid> findByCategory_CategoryId(Long categoryId);
    List<Orchid> findByStatus(String status);
}
