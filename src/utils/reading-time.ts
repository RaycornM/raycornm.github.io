// 阅读时间估算：CJK 字符 ≈400 字/分钟，拉丁词 ≈200 词/分钟
export function readingTimeMinutes(body: string | undefined | null): number {
	if (!body) return 1;
	const text = body
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*`\-\[\]()!|]/g, " ");
	const cjk = (text.match(/[一-鿿぀-ヿ가-힯]/g) || []).length;
	const latin = (text.replace(/[一-鿿぀-ヿ가-힯]/g, " ").match(/\S+/g) || []).length;
	return Math.max(1, Math.round(cjk / 400 + latin / 200));
}
