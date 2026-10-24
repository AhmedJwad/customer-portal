import httpService from "./httpService";

export interface UserRow {
  userType: string | number;
  emailConfirmed: boolean;
  lockoutEnd?: string | null;
}

const dashboardService = { 
  getUsers: () => httpService.get<UserRow[]>("Accounts/all", { page: 1, recordsNumber: 1000 }),
};

export default dashboardService;