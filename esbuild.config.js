const path = require("path")
const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["application.js"],
    bundle: true,
    sourcemap: true,
    watch: process.env.NODE_ENV !== "production",
    outdir: path.join(process.cwd(), "app/assets/builds"),
    absWorkingDir: path.join(process.cwd(), "app/javascript"),
    publicPath: path.join(process.cwd(), "assets"),
    define: {
      "process.env.NLSAccessKeySecret": process.env.NLSAccessKeySecret,
      "process.env.NLSAccessKeyId": process.env.NLSAccessKeyId,
      "process.env.TTSAppKey": process.env.TTSAppKey,
    },
    // custom plugins will be inserted is this array
    plugins: [],
  })
  .catch(() => process.exit(1))
