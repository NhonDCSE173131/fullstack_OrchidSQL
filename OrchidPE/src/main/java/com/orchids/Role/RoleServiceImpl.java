package com.orchids.Role;

import com.orchids.pojo.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public Role getRole(Long id) {
        return roleRepository.findById(id).get();
    }

    @Override
    public Role insertRole(Role role) {
        if (role != null && role.getRoleName() != null && !role.getRoleName().isEmpty()) {
            return roleRepository.save(role);
        } else {
            throw new IllegalArgumentException("Role or role name cannot be null or empty");
        }
    }

    @Override
    public Role updateRole(Role role) {
        //Check t hat the role exists before updating
        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
