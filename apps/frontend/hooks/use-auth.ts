import { fetcher } from '@libs/fetcher';
import { ApiLinkMap } from '@libs/link-map/api-link-map';
import { SignInParam, SignInResult, SignUpParam } from '@repo/dto';

export const useAuth = () => {
  //-------------------------------------------------------------------------
  // login
  //-------------------------------------------------------------------------
  const login = async (param: SignInParam) => {
    await fetcher<SignInParam, SignInResult>(ApiLinkMap.auth.signin(), {
      method: 'POST',
      body: param,
    });
  };

  //-------------------------------------------------------------------------
  // logout
  //-------------------------------------------------------------------------
  const logout = async () => {
    await fetcher(ApiLinkMap.auth.signout(), {
      method: 'POST',
    });
  };

  //-------------------------------------------------------------------------
  // signup
  //-------------------------------------------------------------------------
  const signup = async (dto: SignUpParam) => {
    await fetcher(ApiLinkMap.auth.signup(), {
      method: 'POST',
      body: dto,
    });
  };

  return { login, logout, signup };
};
