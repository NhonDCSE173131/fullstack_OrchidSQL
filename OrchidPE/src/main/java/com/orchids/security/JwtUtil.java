package com.orchids.security;

import com.orchids.pojo.Account;
import com.orchids.Account.AccountRepository;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private final long EXPIRATION_TIME = 864_000_000; // 10 days

    private final AccountRepository accountRepository;

    // Constructor để Spring inject AccountRepository
    public JwtUtil(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    // Generate token với role
    public String generateToken(String username) {
        Account account = accountRepository.findByAccountName(username);
        System.out.println(">>> Role to be added to token: ");
        if (account == null || account.getRole() == null) {
            System.out.println(">>> Account or Role not found: " + username);
            throw new IllegalArgumentException("Account or role not found");
        }



        return Jwts.builder()
                .setSubject(username)
                .claim("role", account.getRole().getRoleName())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    // Lấy username từ token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Lấy role từ token
    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // Kiểm tra token hợp lệ
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
