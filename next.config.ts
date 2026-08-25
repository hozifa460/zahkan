import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تعطيل كل مؤشرات dev
  devIndicators: false,

  // إعدادات النشر
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,

  // متوافق مع النشر الثابت
  reactStrictMode: true,
};

export default nextConfig;
