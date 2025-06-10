import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const pageParam = req.query.page;
		const queryParam = req.query.query;

		const page = typeof pageParam === "string" ? pageParam : "1";
		const query = typeof queryParam === "string" ? queryParam : "";

		const response = await fetch(
			`https://solved.ac/api/v3/search/problem?query=${encodeURIComponent(query)}&page=${page}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
          'x-solvedac-language': 'ko',
				},
			}
		);

		const contentType = response.headers.get("content-type");
		if (!response.ok || !contentType?.includes("application/json")) {
			const text = await response.text();
			throw new Error(`Bad response: ${text.slice(0, 100)}...`);
		}

		const data = await response.json();

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Content-Type", "application/json");
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
}
