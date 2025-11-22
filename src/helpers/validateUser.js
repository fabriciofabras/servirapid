import { URL_SERVER } from "../properties";

export const validateUser = (formData,confirmNewSession, user) => {

  console.log("validateUser->confirmNewSesion", confirmNewSession, user, formData)

    const validateUser = async () => {

      const userId = user !== undefined ? user : "";

      console.log("userId",userId);
    
      const API_BASE_URL = import.meta.env.VITE_API_URL || "https://servirapid-server.vercel.app";

      try {
         const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData,confirmNewSession, userId})
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
      //  alert(data);
  
        return data;
      } catch (error) {
        console.error('Error, servicio login', error);
        throw error;
      }
  
    };
  
    return validateUser();
  
  }