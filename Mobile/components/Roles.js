
export const Roles = {
    VENDOR: 'vendor',
    AGENT: 'agent',
};

export const RolePermissions = {
    [Roles.VENDOR]: {
        canAccess: [
            'Dashboard',
            'Profile',
            'CardScanner',
            'Agents',
            'Templates',
            'ContactLog',
        ],
    },
    [Roles.AGENT]: {
        canAccess: [
            'Dashboard',
            'Profile',
            'Templates',
            'ContactLog',
        ],
    },
};
