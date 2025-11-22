import React, { createContext, useState } from 'react';

// Crear el contexto
export const UserProfileContext = createContext();

// Crear un proveedor de contexto
export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState('guest'); // Perfil por defecto

  return (
    <UserProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};