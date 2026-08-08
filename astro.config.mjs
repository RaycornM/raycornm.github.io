// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://raycornm.github.io',
	integrations: [mdx(), sitemap()],
	// 图片优化配置
	image: {
		// 使用 Sharp 进行图片处理（更快）
		service: {
			entrypoint: 'astro/assets/services/sharp',
			config: {
				// 默认图片质量
				quality: 80,
				// 默认输出格式
				format: 'webp',
			},
		},
		// 注意：不开 remotePatterns。正文远程图在构建期抓取不可控
		// （xu5.net 拒连、byteimg 签名 URL 会过期，任一失败都会中断构建）。
		// 远程图的防盗链问题由 CoverImg 的 referrerpolicy="no-referrer" 解决。
	},
	// 构建优化
	build: {
		// 资源内联阈值（小于 4KB 的资源会内联）
		assetsInlineLimit: 4096,
	},
	// Vite 配置
	vite: {
		build: {
			// 启用 CSS 代码分割
			cssCodeSplit: true,
			// 启用资源预加载
			modulePreload: {
				polyfill: false,
			},
		},
	},
});
