'use client';

import { Box, Flex, Loader, LoadingOverlay, Text } from '@mantine/core';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, use, useState } from 'react';

export interface ILoadingOverlayContext {
  isLoading: boolean;
  showLoadingOverlay: (message?: string) => void;
  hideLoadingOverlay: () => void;
}

export const LoadingOverlayContext = createContext<ILoadingOverlayContext>({
  isLoading: false,
  showLoadingOverlay: () => {},
  hideLoadingOverlay: () => {},
});

export function LoadingOverlayProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState('');

  const showLoadingOverlay = (message?: string) => {
    if (message) {
      setMessage(message);
    }

    setIsLoading(true);
  };

  const hideLoadingOverlay = () => {
    setMessage('');
    setIsLoading(false);
  };

  return (
    <LoadingOverlayContext.Provider value={{ isLoading, showLoadingOverlay, hideLoadingOverlay }}>
      <Box pos="relative">
        <LoadingOverlay
          zIndex={1000}
          visible={isLoading}
          loaderProps={{
            children: (
              <Flex direction="column" gap="md" align="center">
                <Loader type="bars"></Loader>
                <Text fw="bold" size="xl">
                  {message}
                </Text>
              </Flex>
            ),
          }}
        />
        {children}
      </Box>
    </LoadingOverlayContext.Provider>
  );
}
