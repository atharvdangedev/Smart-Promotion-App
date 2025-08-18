import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useUserRole = () => {
    const [role, setRole] = useState(null);
    const { rolename } = useAuthStore();

    useEffect(() => {
        const getRole = async () => {
            try {
                // const storedRole = await AsyncStorage.getItem('user_type');
                // const storedRole = rolename;
                setRole(rolename);
                console.log(rolename);
            } catch (err) {
                console.log('Error fetching user role', err);
                setRole(null);
            }
        };
        getRole();
    }, []);

    return role;
};
