import { NextResponse } from 'next/server';
import { buildSearchIndex } from '@libs/api/build-search-index';

// 빌드 타임에 정적 파일로 prerender 한다(런타임 서버 비용 0).
export const dynamic = 'force-static';

/**
 * 클라이언트 검색이 사용할 정적 검색 인덱스(JSON)를 제공한다.
 * GET /search-index.json
 */
export async function GET() {
  const docs = await buildSearchIndex();
  return NextResponse.json(docs);
}
