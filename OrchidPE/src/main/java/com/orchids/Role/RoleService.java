package com.orchids.Role;

import com.orchids.pojo.Role;

import java.util.List;

public interface RoleService {
   public Role getRole(Long id);
   public Role insertRole(Role role);
   public Role updateRole(Role role);
    public void deleteRole(Long id);
    public List<Role> getAllRoles();
}
