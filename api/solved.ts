import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch('https://solved.ac/api/v3/problem/class', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // solved.ac가 HTML 에러 페이지를 줄 수도 있으므로 안전하게 파싱 시도
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Bad response: ${text.slice(0, 100)}...`);
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*'); // 또는 특정 도메인 제한
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
