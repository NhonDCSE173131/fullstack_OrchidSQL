package com.orchids.Account;

import com.orchids.dto.AccountRequest;
import com.orchids.dto.AccountResponse;
import com.orchids.pojo.Account;
import com.orchids.pojo.Role;
import com.orchids.Role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Account validateLogin(String username, String password) {
        Account account = accountRepository.findByAccountName(username);
        if (account != null && passwordEncoder.matches(password, account.getPassword())) {
            return account;
        }
        return null;
    }

    @Override
    public AccountResponse registerAccount(AccountRequest request) {
        Account account = new Account();
        account.setAccountName(request.getAccountName());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName("ROLE_USER").orElseThrow(() -> new RuntimeException("Role not found"));
        account.setRole(role);

        Account saved = accountRepository.save(account);

        AccountResponse response = new AccountResponse();
        response.setAccountId(saved.getAccountId());
        response.setAccountName(saved.getAccountName());
        response.setEmail(saved.getEmail());
        response.setRoleId(saved.getRole() != null ? saved.getRole().getRoleId() : null);

        return response;
    }
    public AccountResponse registerAccountAdmin(AccountRequest request) {
        Account account = new Account();
        account.setAccountName(request.getAccountName());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName("ROLE_ADMIN").orElseThrow(() -> new RuntimeException("Role not found"));
        account.setRole(role);

        Account saved = accountRepository.save(account);

        AccountResponse response = new AccountResponse();
        response.setAccountId(saved.getAccountId());
        response.setAccountName(saved.getAccountName());
        response.setEmail(saved.getEmail());
        response.setRoleId(saved.getRole() != null ? saved.getRole().getRoleId() : null);

        return response;
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
}