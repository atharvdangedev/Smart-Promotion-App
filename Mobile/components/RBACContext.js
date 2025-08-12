// // context/RBACContext.js

// import React, { createContext, useContext, useEffect, useState } from 'react';
// // import { getItem } from '../utils/storage';
// // import { Roles } from '../config/roles';

// const RBACContext = createContext();

// export const RBACProvider = ({ children }) => {
//     const [role, setRole] = useState(null);

//     const loadRole = async () => {
//         const storedRole = await getItem('user_type'); // 'vendor' or 'agent'
//         setRole(storedRole);
//     };

//     useEffect(() => {
//         loadRole();
//     }, []);

//     return (
//         <RBACContext.Provider value={{ role, setRole }}>
//             {children}
//         </RBACContext.Provider>
//     );
// };

// export const useRBAC = () => useContext(RBACContext);
