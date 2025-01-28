interface LoginResponse {
  code: number;
  locale: string;
  message: string;
  data: null | {
    token: string;
    expires: number;
    tokenType: string;
    refreshToken: string;
  };
}

const authService = {
  requestOTP: async (phoneNumber: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(
        "https://account.eight.com.sg/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: phoneNumber,
          }),
        },
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to request OTP");
    }
  },

  validateOTP: async (
    phoneNumber: string,
    otp: string,
  ): Promise<LoginResponse> => {
    try {
      const response = await fetch(
        "https://account.eight.com.sg/api/v1/login/otp/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: phoneNumber,
            token: otp,
          }),
        },
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to validate OTP");
    }
  },

  refreshToken: async (
    refreshToken: string,
    oldBearerToken: string,
  ): Promise<LoginResponse> => {
    try {
      const response = await fetch(
        "https://account.eight.com.sg/api/v1/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oldBearerToken}`,
          },
          body: JSON.stringify({
            refreshToken,
          }),
        },
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to refresh token");
    }
  },
};

export default authService;