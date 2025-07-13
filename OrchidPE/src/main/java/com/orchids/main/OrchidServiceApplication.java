package com.orchids.main;

import com.orchids.pojo.Role;
import com.orchids.Role.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.orchids.pojo")
@ComponentScan(basePackages = {
        "com.orchids.controller",
        "com.orchids.Account",
        "com.orchids.Role",
        "com.orchids.Category",
        "com.orchids.config",
        "com.orchids.Orchid",
        "com.orchids.Order",
        "com.orchids.Role",
        "com.orchids.minio",
        "com.orchids.security"

})
@EnableJpaRepositories(basePackages = {
        "com.orchids.controller",
        "com.orchids.Account",
        "com.orchids.Role",
        "com.orchids.Category",
        "com.orchids.config",
        "com.orchids.Orchid",
        "com.orchids.Order",
        "com.orchids.Role",
        "com.orchids.minio",
        "com.orchids.security"
})
public class OrchidServiceApplication implements CommandLineRunner {
    @Autowired
    private RoleService roleService;

    public static void main(String[] args) {
        SpringApplication.run(OrchidServiceApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        int roleCount = roleService.getAllRoles().size();
        if (roleCount == 0) {
            Role role = new Role();
            role.setRoleName("Admin");
            Role role2 = new Role();
            role2.setRoleName("User");
            roleService.insertRole(role);
            roleService.insertRole(role2);
        }
    }
}
