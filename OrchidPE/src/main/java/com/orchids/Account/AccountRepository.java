package com.orchids.Account;

import com.orchids.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account,Long> {


     @Query("SELECT a FROM Account a JOIN FETCH a.role WHERE a.accountName = :username")
     Account findByAccountName(@Param("username") String username);
}
