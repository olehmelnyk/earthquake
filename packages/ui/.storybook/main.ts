import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack",
    "@storybook/addon-themes"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {
      "nextConfigPath": "../../../apps/web/next.config.js"
    }
  },
  "staticDirs": ["../../../public"]
};
export default config;