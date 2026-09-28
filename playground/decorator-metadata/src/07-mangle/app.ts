// 따로 빌드한 두 번들을 한 페이지에서 불러오는 상황
await import('../../dist/mangle/chart.min.js' as string);
await import('../../dist/mangle/map.min.js' as string);
