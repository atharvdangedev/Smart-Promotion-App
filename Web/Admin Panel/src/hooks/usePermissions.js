import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "../Partials/Apps/utils/permissions";

const usePermissions = () => {
  const userRole = useSelector((state) => state.auth.user?.role);

  /**
   * Checks if the current user has a specific permission.
   * @param permission The permission string to check (e.g., 'plans:edit').
   * @returns True if the user has the permission, false otherwise.
   */
  const can = (permission) => {
    if (!userRole) {
      return false; // No user or role, no permissions
    }

    const allowedPermissions = ROLE_PERMISSIONS[userRole];

    if (!allowedPermissions) {
      console.warn(`No permissions defined for role: ${userRole}`);
      return false;
    }

    return allowedPermissions.includes(permission);
  };

  /**
   * Checks if the current user has any of the provided permissions.
   * Useful for OR conditions (e.g., can I edit OR create?).
   * @param permissions An array of permission strings to check.
   * @returns True if the user has at least one of the permissions, false otherwise.
   */
  const canAny = (permissions) => {
    if (!userRole) return false;
    const allowedPermissions = ROLE_PERMISSIONS[userRole];
    if (!allowedPermissions) return false;
    return permissions.some((p) => allowedPermissions.includes(p));
  };

  /**
   * Checks if the current user has all of the provided permissions.
   * Useful for AND conditions (e.g., can I edit AND delete?).
   * @param permissions An array of permission strings to check.
   * @returns True if the user has all of the permissions, false otherwise.
   */
  const canAll = (permissions) => {
    if (!userRole) return false;
    const allowedPermissions = ROLE_PERMISSIONS[userRole];
    if (!allowedPermissions) return false;
    return permissions.every((p) => allowedPermissions.includes(p));
  };

  return { can, canAny, canAll, userRole };
};

export default usePermissions;
