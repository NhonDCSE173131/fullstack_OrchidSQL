package com.orchids.Account;

import com.orchids.dto.AccountRequest;
import com.orchids.dto.AccountResponse;
import com.orchids.pojo.Account;

import java.util.List;

public interface AccountService {
    public List<Account> getAllAccounts();
    public Account validateLogin(String username, String password) ;
    public AccountResponse registerAccount(AccountRequest account);
    public AccountResponse registerAccountAdmin(AccountRequest request);
}
