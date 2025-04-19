// import { buttonRecipe } from './button.recipe';
import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';
import { layerStyles } from './layer-style';
import { textStyles } from './text-style';

export const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        myBlue: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#a3cfff" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#173da6" },
          800: { value: "#1a3478" },
          900: { value: "#14204a" },
          950: { value: "#0c142e" },
        },
      },
    },
    semanticTokens: {
      colors: {
        myBlue: {
          solid: { value: "{colors.myBlue.800}" },
          contrast: { value: "{colors.myBlue.100}" },
          fg: { value: "{colors.myBlue.700}" },
          muted: { value: "{colors.myBlue.100}" },
          subtle: { value: "{colors.myBlue.200}" },
          emphasized: { value: "{colors.myBlue.300}" },
          focusRing: { value: "{colors.myBlue.500}" },
        },
      },
    },
    textStyles,
    layerStyles,
  },
});
