const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Sin assetPrefix: los assets son /_next/... y funcionan en public_html (raíz del dominio).
  // Si Hostinger sirve desde un subdirectorio, usa basePath: '/tu-subdir' en su lugar.
};
module.exports = withNextIntl(nextConfig);
