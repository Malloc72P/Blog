import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { Plugin } from 'vite';

/**
 * 페이지 링크를 index.html에 삽입하는 Vite 플러그인
 */
export function pageLinkGenerator(): Plugin {
  // __dirname은 devops 디렉토리니까 ..으로 이전 경로로 올라가야함
  const pagesDir = resolve(__dirname, '../pages');

  /**
   * 디렉토리 내의 모든 HTML 파일 경로를 재귀적으로 가져옵니다.
   */
  function getHtmlFiles(dir: string, basePath = ''): string[] {
    const files: string[] = [];

    for (const name of readdirSync(dir)) {
      const fullPath = resolve(dir, name);
      const relativePath = basePath ? `${basePath}/${name}` : name;

      if (statSync(fullPath).isDirectory()) {
        files.push(...getHtmlFiles(fullPath, relativePath));
      } else if (name.endsWith('.html')) {
        files.push(relativePath);
      }
    }
    return files;
  }

  /**
   * 주어진 디렉토리 이름에 해당하는 HTML 파일들의 링크 목록을 생성합니다.
   */
  function generateLinkList(dirName: string): string {
    const dirPath = resolve(pagesDir, dirName);
    const htmlFiles = getHtmlFiles(dirPath);

    const links = htmlFiles
      .map((file) => `<li><a href="/pages/${dirName}/${file}">${file}</a></li>`)
      .join('\n');

    return `<ul>${links}</ul>`;
  }

  return {
    name: 'pages-link-plugin',
    transformIndexHtml(html) {
      // exam, demo 디렉토리의 링크 목록 생성
      const exams = generateLinkList('exam');
      const demos = generateLinkList('demo');

      const template = `
            <h1>Demos</h1>
            ${demos}
            <hr>
            <h1>Examples</h1>
            ${exams}
            `;

      return html.replace('<!--PAGES_LINKS-->', template);
    },
  };
}
