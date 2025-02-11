import { PageLinkMap } from '@libs/link-map';
import { useRouter } from 'next-nprogress-bar';

export const useNavigator = () => {
  const router = useRouter();
  const createNavigateFn = (href: string) => {
    return () => router.push(href);
  };

  return {
    moveTo: {
      auth: {
        login: createNavigateFn(PageLinkMap.auth.login()),
        signup: createNavigateFn(PageLinkMap.auth.signup()),
      },
      public: {
        landing: createNavigateFn(PageLinkMap.public.landing()),
      },
      protected: {
        main: createNavigateFn(PageLinkMap.protected.main()),
        artists: createNavigateFn(PageLinkMap.protected.artists()),
        account: createNavigateFn(PageLinkMap.protected.account()),
      },
      external: {
        inabaseGithub: () => window.open('https://github.com/Malloc72P/inabase', '_blank'),
        malloc72pGithub: () => window.open('https://github.com/Malloc72P', '_blank'),
      },
    },
  };
};
