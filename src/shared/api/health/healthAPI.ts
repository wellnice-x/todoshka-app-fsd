import { axiosClient } from "../base";

export const getHealth = () => axiosClient.get("/tasks?select=id&limit=1");
