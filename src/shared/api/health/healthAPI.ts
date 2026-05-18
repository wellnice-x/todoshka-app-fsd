import axiosClient from "@/shared/api/base/axiosClient";

export const getHealth = () => axiosClient.get("/tasks?select=id&limit=1");
