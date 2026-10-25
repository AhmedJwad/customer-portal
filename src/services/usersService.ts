import httpService from "./httpService";

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  address?: string;
  photo?: string | null;
  userType: string | number;
  emailConfirmed: boolean;
  lockoutEnd?: string | null;
}

const usersService = {
  getPage: (page: number, recordsNumber: number, filter: string) =>
    httpService.get<UserItem[]>("Accounts/all", {
      page,
      recordsNumber,
      ...(filter ? { filter } : {}),
    }),

  getCount: (filter: string) =>
    httpService.get<number>("Accounts/recordsNumber", filter ? { filter } : null),
};

export default usersService;