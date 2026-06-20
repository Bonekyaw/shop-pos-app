const { getDefaultConfig } = require("expo/metro-config");
const { loadProjectEnv } = require("@expo/env");

const projectRoot = __dirname;

loadProjectEnv(projectRoot);

// Expo inlines EXPO_PUBLIC_* into the JS bundle; map API_URL from .env.
if (process.env.API_URL) {
  process.env.EXPO_PUBLIC_API_URL = process.env.API_URL;
}

module.exports = getDefaultConfig(projectRoot);
