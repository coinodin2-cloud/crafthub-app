# Craft Hub — Desktop App

The desktop app for [crafthubs.net](https://crafthubs.net): plugins, mods, texture packs, shaders and Minecraft servers.

- **One-click install** — mods, resource packs, shaders, worlds and datapacks go straight into your `.minecraft` folder
- **Play** — pick any installed version (Vanilla / Fabric / Forge / NeoForge / Quilt / OptiFine) and open the official launcher with it
- **Add Fabric / Quilt** to any Minecraft version
- **My mods** — turn mods on and off without deleting them
- **Update all** — updates everything you installed through the app
- **Windows notifications** and **automatic updates**

## Download

Get the latest `CraftHubSetup-x.y.z.exe` from [Releases](https://github.com/coinodin2-cloud/crafthub-app/releases/latest).

> The installer is not code-signed yet — Windows may show "Windows protected your PC". Click **More info → Run anyway**.

## Development

```bash
npm install
npm start          # runs against https://crafthubs.net
npm run dist       # builds dist/CraftHubSetup-x.y.z.exe
npm run release    # builds and publishes a GitHub release (needs GH_TOKEN)
```

Bump `version` in `package.json` before every release — installed apps update themselves from the latest release.
