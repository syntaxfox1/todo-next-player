import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/todo-next-player",
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
