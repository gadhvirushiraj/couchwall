/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/couchwall" : "",
  output: "export",
};

module.exports = nextConfig;
