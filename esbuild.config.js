const path = require("path")
const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["application.js"],
    bundle: true,
    sourcemap: true,
    watch: true,
    outdir: path.join(process.cwd(), "app/assets/builds"),
    absWorkingDir: path.join(process.cwd(), "app/javascript"),
    publicPath: path.join(process.cwd(), "assets"),
    define: {
      "process.env.NLSAccessKeySecret": process.env.NLSAccessKeySecret,
      "process.env.NLSAccessKeyId": process.env.NLSAccessKeyId,
    },
    // custom plugins will be inserted is this array
    plugins: [],
  })
  .catch(() => process.exit(1))
