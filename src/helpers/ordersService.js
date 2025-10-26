// src/api/ordersService.js
import apiClient from "./apiClient";

export const getOrders = async () => {
  try {
    const response = await apiClient.get("/getOrders");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    throw error;
  }
};

export const addOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/addOrder", orderData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la orden:", error);
    throw error;
  }
};
