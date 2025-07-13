package com.orchids.Account;

import com.orchids.dto.AccountRequest;
import com.orchids.dto.AccountResponse;
import com.orchids.dto.AuthResponse;
import com.orchids.dto.LoginRequest;
import com.orchids.pojo.Account;
import com.orchids.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping(value = "/api/accounts", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Account account = accountService.validateLogin(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (account == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Invalid credentials");
                return ResponseEntity.badRequest().body(response);
            }
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }


    @GetMapping
    @Operation(
            summary = "Get all accounts",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved accounts")
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody AccountRequest account) {
        try {
            AccountResponse created = accountService.registerAccount(account);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping(value = "/register/admin", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerAdmin(@RequestBody AccountRequest account) {
        try {
            AccountResponse created = accountService.registerAccountAdmin(account);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}