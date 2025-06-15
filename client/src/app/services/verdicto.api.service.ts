import axios from "axios";

const api = axios.create({
  baseURL: "http://185.46.143.253",
});

export const createUser = async (user: {
  name: string;
  email: string;
  address: string;
  photoUri: string;
  bio: string;
  portfolioUri: string;
  isMediator: boolean;
}) => {
  const response = await api.post("/users", user);
  return response.data;
};

export const getDisputes = async (walletAddress: string) => {
  const response = await api.get(`/disputes/${walletAddress}`)
  return response.data
}

export default api;
