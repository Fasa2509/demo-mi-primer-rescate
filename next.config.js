/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 100,
  swcMinify: true,
  webpack: ( config ) => {
    config.resolve.fallback = { fs: false, net: false, dns: false }
    return config;
  },
  images: {
    domains: [
      "fasa-bucket.s3.sa-east-1.amazonaws.com"
    ]
  }
}

module.exports = nextConfig
