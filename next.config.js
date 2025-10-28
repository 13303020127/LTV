/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires */

// 最简化的配置，专注于确保构建成功
const nextConfig = {
  // 核心配置
  reactStrictMode: false,
  swcMinify: false,
  
  // 避免静态预渲染相关配置已移除
  
  // 页面扩展
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // 图片配置
  images: {
    // 移除lain.bgm.tv，避免Next.js尝试优化这些图片
    domains: ['localhost', 'picsum.photos', 'img9.doubanio.com', 'img2.doubanio.com', 'img3.doubanio.com', 'img1.doubanio.com', 'img.doubanio.cmliussss.net'],
    // 完全禁用图片优化，让浏览器直接加载图片
    unoptimized: true,
  },

  // 基本webpack配置
  webpack: (config) => {
    // SVG支持
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // 修复Node.js核心模块依赖问题
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

// 关键：对于Cloudflare Pages，我们需要确保输出模式正确
module.exports = nextConfig;
// 不使用PWA以避免构建问题

// 为静态导出配置PWA（保持禁用状态）
const withPWA = (config) => config;
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
//   register: true,
//   skipWaiting: true,
// });

module.exports = withPWA(nextConfig);
