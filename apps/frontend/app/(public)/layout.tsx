import { PropsWithChildren } from 'react';
import PublicClientLayout from './public-client-layout';

export default async function PublicPageLayout({ children }: PropsWithChildren) {
  return <PublicClientLayout>{children}</PublicClientLayout>;
}
