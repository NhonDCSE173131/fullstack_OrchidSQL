package com.orchids.Orchid;

import com.orchids.dto.OrchidRequest;
import com.orchids.dto.OrchidResponse;
import java.util.List;

public interface OrchidService {
    OrchidResponse createOrchid(OrchidRequest request);
    OrchidResponse updateOrchid(Long orchidId, OrchidRequest request);
    void deleteOrchid(Long orchidId);
    OrchidResponse getOrchidById(Long orchidId);
    List<OrchidResponse> getAllOrchids();
    List<OrchidResponse> getOrchidsByCategory(Long categoryId);
}