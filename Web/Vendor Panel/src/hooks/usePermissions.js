import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "../Partials/Apps/utils/permissions";
import { useMemo } from "react";

const usePermissions = () => {
  const userRoles = useSelector((state) => state.auth.user?.role);

  const parsedUserRoles = useMemo(() => {
    if (Array.isArray(userRoles)) {
      return userRoles;
    }
    if (typeof userRoles === "string") {
      return userRoles
        .split(",")
        .map(Number)
        .filter((role) => !isNaN(role));
    }
    if (typeof userRoles === "number") {
      return [userRoles];
    }
    return [];
  }, [userRoles]);

  const effectivePermissions = useMemo(() => {
    const permissionsSet = new Set();
    parsedUserRoles.forEach((role) => {
      const roleSpecificPermissions = ROLE_PERMISSIONS[String(role)];
      if (roleSpecificPermissions && Array.isArray(roleSpecificPermissions)) {
        roleSpecificPermissions.forEach((permission) => {
          permissionsSet.add(permission);
        });
      } else {
        console.warn(
          `usePermissions: No permissions defined or invalid format for role: ${role}`
        );
      }
    });
    return permissionsSet;
  }, [parsedUserRoles]);

  /**
   * Checks if the current user has a specific permission.
   * @param permission The permission string to check (e.g., 'plans:edit').
   * @returns True if the user has the permission, false otherwise.
   */
  const can = (permission) => {
    if (!userRoles) {
      return false; // No user or role, no permissions
    }

    if (!permission || effectivePermissions.size === 0) {
      return false;
    }
    return effectivePermissions.has(permission);
  };

  /**
   * Checks if the current user has any of the provided permissions.
   * Useful for OR conditions (e.g., can I edit OR create?).
   * @param permissions An array of permission strings to check.
   * @returns True if the user has at least one of the permissions, false otherwise.
   */
  const canAny = (permissions) => {
    if (!userRoles) return false;
    if (
      !permissions ||
      permissions.length === 0 ||
      effectivePermissions.size === 0
    ) {
      return false;
    }
    return permissions.some((p) => effectivePermissions.has(p));
  };

  /**
   * Checks if the current user has all of the provided permissions.
   * Useful for AND conditions (e.g., can I edit AND delete?).
   * @param permissions An array of permission strings to check.
   * @returns True if the user has all of the permissions, false otherwise.
   */
  const canAll = (permissions) => {
    if (!userRoles) return false;
    if (
      !permissions ||
      permissions.length === 0 ||
      effectivePermissions.size === 0
    ) {
      return false;
    }
    return permissions.every((p) => effectivePermissions.has(p));
  };

  return { can, canAny, canAll, userRoles };
};

export default usePermissions;
