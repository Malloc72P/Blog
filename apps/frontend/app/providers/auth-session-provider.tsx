'use client';

import { ProfileResult } from '@repo/dto';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';

export interface IProfileContext {
  profile: ProfileResult;
  setProfile: Dispatch<SetStateAction<ProfileResult>>;
}

export const ProfileContext = createContext<IProfileContext>({
  profile: { id: '', email: '', name: '' },
  setProfile: () => {},
});
export interface AuthSessionProviderProps extends PropsWithChildren {
  initialProfile: ProfileResult;
}

export function ProfileProvider({ children, initialProfile }: AuthSessionProviderProps) {
  const [profile, setProfile] = useState<ProfileResult>(initialProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>
  );
}
