/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 컴포넌트/앱 라우트와 MDX 포스트(page.mdx)까지 클래스 스캔 대상에 포함한다
    './src/components/**/*.{js,ts,jsx,tsx,md,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,md,mdx}',
    './src/mdx-components.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        // sans: ['var(--font-noto-sans-kr)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
