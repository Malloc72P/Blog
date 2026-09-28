// chart와 map을 각각 따로 번들하고 terser로 압축한다. module: true 를 줘야 최상위 클래스 이름도 줄인다.
import { rollup } from 'rollup';
import { minify } from 'terser';
import { mkdir, writeFile } from 'node:fs/promises';

// 07-mangle: 이름을 키로 쓰는 저장소, 08-object-key: 클래스 객체를 키로 쓰는 저장소
const targets = [
  { src: 'out/07-mangle', dist: 'dist/mangle' },
  { src: 'out/08-object-key', dist: 'dist/object-key' },
];

// 이름을 키로 쓰는 저장소를 번들 하나 안에서 압축했을 때
const single = await rollup({ input: 'out/05-target/by-name.js', onwarn() {} });
const { output: singleOutput } = await single.generate({ format: 'es' });
await mkdir('dist/mangle', { recursive: true });
await writeFile('dist/mangle/by-name.min.js', (await minify(singleOutput[0].code, { module: true })).code ?? '');

for (const { src, dist } of targets) {
  await mkdir(dist, { recursive: true });

  for (const name of ['chart', 'map']) {
    const bundle = await rollup({ input: `${src}/${name}.js`, onwarn() {} });
    const { output } = await bundle.generate({ format: 'es' });
    const min = await minify(output[0].code, { module: true });
    await writeFile(`${dist}/${name}.min.js`, min.code ?? '');
  }
}
