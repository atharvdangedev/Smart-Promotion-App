/* eslint-disable react/prop-types */
import usePermissions from "../../../hooks/usePermissions";

const Can = ({ do: permissionString, children, else: fallback = null }) => {
  const { can } = usePermissions();

  const hasPermission = can(permissionString);

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default Can;
