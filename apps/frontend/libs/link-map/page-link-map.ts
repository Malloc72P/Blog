export const PageLinkMap = {
  auth: {
    login: () => '/login',
    signup: () => '/signup',
  },
  protected: {
    main: () => '/main',
    artists: () => '/artists',
    account: () => '/account',
  },
  public: {
    landing: () => '/',
  },
} as const;
