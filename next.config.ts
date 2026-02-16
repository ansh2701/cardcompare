import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark better-sqlite3 as a server-external package so it doesn't get bundled
  serverExternalPackages: ["better-sqlite3"],

  // Output standalone mode for deployment
  output: "standalone",
};

export default nextConfig;
