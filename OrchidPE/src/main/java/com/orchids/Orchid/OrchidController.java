package com.orchids.Orchid;

import com.orchids.dto.OrchidRequest;
import com.orchids.dto.OrchidResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/orchids", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class OrchidController {

    private final OrchidService orchidService;

    @Operation(
        summary = "Get all orchids",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved orchids")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @GetMapping
    public ResponseEntity<List<OrchidResponse>> getAllOrchids() {
        List<OrchidResponse> orchids = orchidService.getAllOrchids();
        return ResponseEntity.ok(orchids);
    }

    @Operation(
        summary = "Get orchid by ID",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved orchid")
    @ApiResponse(responseCode = "404", description = "Orchid not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @GetMapping("/{id}")
    public ResponseEntity<OrchidResponse> getOrchidById(@PathVariable Long id) {
        OrchidResponse orchid = orchidService.getOrchidById(id);
        if (orchid != null) {
            return ResponseEntity.ok(orchid);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Get orchids by category",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved orchids by category")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<OrchidResponse>> getOrchidsByCategory(@PathVariable Long categoryId) {
        List<OrchidResponse> orchids = orchidService.getOrchidsByCategory(categoryId);
        return ResponseEntity.ok(orchids);
    }

    @Operation(
        summary = "Create a new orchid",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "201", description = "Orchid created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrchidResponse> createOrchid(@ModelAttribute OrchidRequest request) {
        OrchidResponse created = orchidService.createOrchid(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
            summary = "Update an existing orchid",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Orchid updated successfully")
    @ApiResponse(responseCode = "404", description = "Orchid not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrchidResponse> updateOrchid(
            @PathVariable Long id,
            @ModelAttribute OrchidRequest request) {

        OrchidResponse updated = orchidService.updateOrchid(id, request);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
            summary = "Delete an orchid",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Orchid deleted successfully")
    @ApiResponse(responseCode = "404", description = "Orchid not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteOrchid(@PathVariable Long id) {
        orchidService.deleteOrchid(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Orchid deleted successfully");
        return ResponseEntity.ok(response);
    }
}