package com.orchids.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountResponse {
    private Long accountId;
    private String accountName;
    private String email;
    private Long roleId;
}
