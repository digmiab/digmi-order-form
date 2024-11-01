/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    SMTP_HOST: 'smtp.office365.com',
    SMTP_PORT: '587',
    SMTP_USER: 'noreply@digmi.se',
    // Don't include SMTP_PASSWORD here
  },
  experimental: {
    serverActions: true
  }
}

export default nextConfig