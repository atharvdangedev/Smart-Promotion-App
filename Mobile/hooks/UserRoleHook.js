import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserRole = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const getRole = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('user_type');
                console.log(storedRole);
                setRole(storedRole);
            } catch (err) {
                console.log('Error fetching user role', err);
                setRole(null);
            }
        };
        getRole();
    }, []);

    return role;
};
