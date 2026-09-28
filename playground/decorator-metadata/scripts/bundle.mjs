// tsc 결과물을 Rollup으로 번들하고 terser(module: true)로 압축해 크기와 포함 여부를 확인한다.
// 먼저 npm run build 로 out, out-nometa, out-helpers 를 만들어 둬야 한다.
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { minify } from 'terser';
import { gzipSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';

const cases = [
  { name: '데코레이터 없음', input: 'out/06-bundle/entry-plain.js' },
  { name: 'TitleModel만, 메타데이터 끔', input: 'out-nometa/06-bundle/entry-title.js' },
  { name: 'TitleModel만, 메타데이터 켬', input: 'out/06-bundle/entry-title.js' },
  { name: '라이브러리 엔트리, 메타데이터 켬', input: 'out/06-bundle/entry-decorated.js' },
  { name: '라이브러리 엔트리, 메타데이터 켬, importHelpers', input: 'out-helpers/06-bundle/entry-decorated.js' },
  { name: '라이브러리 엔트리, moduleSideEffects: false', input: 'out/06-bundle/entry-decorated.js', treeshake: { moduleSideEffects: false } },
  { name: '쓰지 않는 클래스에만 빈 데코레이터', input: 'out/06-bundle/entry-noop.js' },
];

await mkdir('dist/bundle', { recursive: true });

for (const [index, { name, input, treeshake }] of cases.entries()) {
  const bundle = await rollup({ input, treeshake, plugins: [nodeResolve()], onwarn() {} });
  const { output } = await bundle.generate({ format: 'es' });
  const code = output[0].code;
  const minCode = (await minify(code, { module: true })).code ?? '';

  await writeFile(`dist/bundle/case${index + 1}.js`, code);
  await writeFile(`dist/bundle/case${index + 1}.min.js`, minCode);

  console.log(`case${index + 1}. ${name}`);
  console.log('  terser 결과:', Buffer.byteLength(minCode), '바이트 / gzip:', gzipSync(minCode).length, '바이트');
  console.log('  LegendModel 포함:', code.includes('class LegendModel'), '/ design:type 포함:', minCode.includes('design:type'));
}
