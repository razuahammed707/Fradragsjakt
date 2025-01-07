// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
