module.exports = {
  apps: [
    {
      name: "yedc-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "dev -p 3000",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3000
      }
    }
  ]
};
