import { fetcher } from '@libs/fetcher';
import { ApiLinkMap } from '@libs/link-map';
import { ProfileResult, UpdateProfileInput, UpdateProfileOutput } from '@repo/dto';
import useSWR from 'swr';

export function useProfile() {
  const updateProfile = async ({ id, name }: { id: string } & UpdateProfileInput) => {
    return await fetcher<UpdateProfileInput, UpdateProfileOutput>(
      ApiLinkMap.auth.profile.update(id),
      {
        body: {
          name,
        },
        method: 'PATCH',
      }
    );
  };

  return { updateProfile };
}
