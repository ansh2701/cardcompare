import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark better-sqlite3 as a server-external package so it doesn't get bundled
  serverExternalPackages: ["better-sqlite3"],

  // Output standalone mode for deployment
  output: "standalone",

  // Ensure cards.db is included in the serverless function bundle
  experimental: {
    // @ts-expect-error: outputFileTracingIncludes is valid but missing from type definition
    outputFileTracingIncludes: {
      "/api/**/*": ["./cards.db"],
      "/**/*": ["./cards.db"],
    },
  },
};

export default nextConfig;
