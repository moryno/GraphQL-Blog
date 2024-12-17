import { REGISTER_ROUTE } from "constants/routes";

export const getIsRegisterRoute = (pathname, search) => {
  return `${pathname}${search}`.includes(REGISTER_ROUTE);
};
