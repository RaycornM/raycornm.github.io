import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// 构建期生成全文搜索索引（blog + photo）
export const GET: APIRoute = async () => {
	const blog = await getCollection('blog');
	const photo = await getCollection('photo');

	function fmtDate(d: Date): string {
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		return `${mm} · ${d.getFullYear()}`;
	}

	const index = [
		...blog.map((p) => ({
			type: 'blog' as const,
			title: p.data.title,
			desc: p.data.description,
			tags: p.data.tags,
			url: `/blog/${p.id}/`,
			date: fmtDate(p.data.pubDate),
		})),
		...photo.map((p) => ({
			type: 'photo' as const,
			title: p.data.title,
			desc: p.data.description,
			tags: [] as string[],
			url: `/photo/${p.id}/`,
			date: fmtDate(p.data.pubDate),
		})),
	];

	return new Response(JSON.stringify(index), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
