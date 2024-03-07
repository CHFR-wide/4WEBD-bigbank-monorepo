const signIn = {
  email: 'mockUser@test.com',
  password: 'pass123',
};

const signUp = {
  ...signIn,
  username: 'mockUser',
};

const authResponse = {
  access_token: 'mockJwtToken',
};

export const authMocks = { signIn, signUp, authResponse };
