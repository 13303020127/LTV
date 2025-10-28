/* eslint-disable @typescript-eslint/no-explicit-any */

// 关键：强制动态渲染，避免预渲染问题
export const dynamic = 'force-dynamic';

import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import './globals.css';

import { GlobalErrorIndicator } from '../components/GlobalErrorIndicator';
import NavbarGate from '../components/NavbarGate';
import ParticleBackground from '../components/ParticleBackground';
import { SiteProvider } from '../components/SiteProvider';
import { ThemeProvider } from '../components/ThemeProvider';
import TopNavbar from '../components/TopNavbar';

const inter = Inter({ subsets: ['latin'] });

// 动态生成 metadata，支持配置更新后的标题变化
// 使用静态元数据，避免在构建时调用getConfig
export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'DecoTV',
  description: '影视聚合',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 直接使用环境变量和默认值
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DecoTV';
  const announcement =
    process.env.ANNOUNCEMENT ||
    '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。';

  const doubanProxyType =
    process.env.NEXT_PUBLIC_DOUBAN_PROXY_TYPE || 'cmliussss-cdn-tencent';
  const doubanProxy = process.env.NEXT_PUBLIC_DOUBAN_PROXY || '';
  const doubanImageProxyType =
    process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE || 'cmliussss-cdn-tencent';
  const doubanImageProxy = process.env.NEXT_PUBLIC_DOUBAN_IMAGE_PROXY || '';
  const disableYellowFilter =
    process.env.NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true';
  const fluidSearch = process.env.NEXT_PUBLIC_FLUID_SEARCH !== 'false';
  const customCategories = [] as {
    name: string;
    type: 'movie' | 'tv';
    query: string;
  }[];
  
  // 注意：在构建过程中，我们不尝试获取远程配置
  // 所有配置将在客户端运行时通过其他方式加载
  // 这里只使用环境变量或默认值确保构建可以成功

  // 将运行时配置注入到全局 window 对象，供客户端在运行时读取
  const runtimeConfig = {
    STORAGE_TYPE: process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage',
    DOUBAN_PROXY_TYPE: doubanProxyType,
    DOUBAN_PROXY: doubanProxy,
    DOUBAN_IMAGE_PROXY_TYPE: doubanImageProxyType,
    DOUBAN_IMAGE_PROXY: doubanImageProxy,
    DISABLE_YELLOW_FILTER: disableYellowFilter,
    CUSTOM_CATEGORIES: customCategories,
    FLUID_SEARCH: fluidSearch,
  };

  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover'
        />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        {/* 将配置序列化后直接写入脚本，浏览器端可通过 window.RUNTIME_CONFIG 获取 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};`,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-200 bg-animated-gradient`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SiteProvider siteName={siteName} announcement={announcement}>
            <ParticleBackground />
            <NavbarGate>
              <TopNavbar />
            </NavbarGate>
            {children}
            <GlobalErrorIndicator />
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
