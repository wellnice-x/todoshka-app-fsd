import { axiosClient } from "@/shared/api";

export const getHealth = () => axiosClient.get("/tasks?select=id&limit=1");
