import nextJest from 'next/jest.js';

// next/jest: SWC 변환 + Next 환경(.env, next.config 등)을 테스트에 반영한다.
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  // 컴포넌트 렌더 테스트를 위해 jsdom. fs 기반 파이프라인 테스트도 Node가 받쳐주므로 함께 동작한다.
  testEnvironment: 'jsdom',
  // Playwright E2E(e2e/*.spec.ts)는 jest가 잡지 않도록 제외한다(전용 러너로 실행).
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // tsconfig의 path alias를 테스트에서도 해석할 수 있게 매핑한다.
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
