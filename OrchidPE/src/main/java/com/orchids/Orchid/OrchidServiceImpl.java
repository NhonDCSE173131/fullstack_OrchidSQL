package com.orchids.Orchid;

import com.orchids.dto.OrchidRequest;
import com.orchids.dto.OrchidResponse;
import com.orchids.pojo.Orchid;
import com.orchids.minio.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrchidServiceImpl implements OrchidService {
    private final OrchidRepository orchidRepository;
    private final MinioService minioService;
    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public OrchidResponse createOrchid(OrchidRequest request) {
        String presignedImageUrl = null;
        if (request.getOrchidUrl() != null && !request.getOrchidUrl().isEmpty()) {
            presignedImageUrl = minioService.uploadFileAndGetPresignedUrl(request.getOrchidUrl());
        }
        Orchid orchid = new Orchid();
        orchid.setOrchidName(request.getOrchidName());
        orchid.setOrchidDescription(request.getOrchidDescription());
        orchid.setOrchidUrl(presignedImageUrl);
        orchid.setPrice(request.getPrice());
        orchid.setIsNatural(request.getIsNatural());
        orchid.setStatus("ACTIVE");
        // Set category if needed
        Orchid saved = orchidRepository.save(orchid);
        return toResponse(saved);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public OrchidResponse updateOrchid(Long orchidId, OrchidRequest request) {
        String presignedImageUrl = null;
        if (request.getOrchidUrl() != null && !request.getOrchidUrl().isEmpty()) {
            presignedImageUrl = minioService.uploadFileAndGetPresignedUrl(request.getOrchidUrl());
        }
        Orchid orchid = orchidRepository.findById(orchidId).orElseThrow(() -> new RuntimeException("Orchid not found"));
        orchid.setOrchidName(request.getOrchidName());
        orchid.setOrchidDescription(request.getOrchidDescription());
        orchid.setOrchidUrl(presignedImageUrl);
        orchid.setPrice(request.getPrice());
        orchid.setIsNatural(request.getIsNatural());
        orchid.setStatus("ACTIVE");
        // Update category if needed
        Orchid updated = orchidRepository.save(orchid);
        return toResponse(updated);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteOrchid(Long orchidId) {
        Orchid orchid = orchidRepository.findById(orchidId).orElseThrow(() -> new RuntimeException("Orchid not found"));
        orchid.setStatus("DELETED");
        orchidRepository.save(orchid);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public OrchidResponse getOrchidById(Long orchidId) {
        Orchid orchid = orchidRepository.findById(orchidId).orElseThrow();
        return toResponse(orchid);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public List<OrchidResponse> getAllOrchids() {
        return orchidRepository.findByStatus("ACTIVE").stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private OrchidResponse toResponse(Orchid orchid) {
        OrchidResponse response = new OrchidResponse();
        response.setOrchidId(orchid.getOrchidId());
        response.setOrchidName(orchid.getOrchidName());
        response.setOrchidDescription(orchid.getOrchidDescription());
        response.setOrchidUrl(orchid.getOrchidUrl());
        response.setPrice(orchid.getPrice());
        response.setIsNatural(orchid.getIsNatural());
        // Set categoryId if needed
        return response;
    }
    @Override
    public List<OrchidResponse> getOrchidsByCategory(Long categoryId) {
        List<Orchid> orchids = orchidRepository.findByCategory_CategoryId(categoryId);
        return orchids.stream().map(this::toResponse).collect(Collectors.toList());
    }
}