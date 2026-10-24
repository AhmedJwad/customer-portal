import httpService from "./httpService";
import { tokenStorage, type AuthTokens } from "./tokenStorage";

const accountService = {
  login: async (email: string, password: string) => {
    const result = await httpService.post<AuthTokens>("Accounts/Login", { email, password });
    if (!result.error && result.response) tokenStorage.set(result.response);
    return result;
  },

  logout: async () => {
    const tokens = tokenStorage.get();
    if (tokens) {
      await httpService.post("Accounts/Logout", { refreshToken: tokens.refreshToken });
    }
    tokenStorage.clear();
  },

  register: (user: Record<string, any>) => httpService.post("Accounts/CreateUser", user),
  resendConfirmation: (email: string) => httpService.post("Accounts/ResedToken", { email }),
  confirmEmail: (userId: string, token: string) =>
  httpService.get("Accounts/ConfirmEmail", { userId, token }),
  recoverPassword: (email: string) => httpService.post("Accounts/RecoverPassword", { email }),
  resetPassword: (data: Record<string, any>) => httpService.post("Accounts/ResetPassword", data),  
  changePassword: (currentPassword: string, newPassword: string, confirm: string) =>
  httpService.post("Accounts/changePassword", {
    currentPassword,
    newPassword,
    confirm,
  }),
getProfile: () => httpService.get<Record<string, any>>("Accounts"),
updateProfile: async (body: Record<string, any>) => {
  const result = await httpService.put<AuthTokens>("Accounts", body); 
  if (!result.error && result.response) tokenStorage.set(result.response);
  return result;
},
};


export default accountService;