"use client";

import { Theme, color, fontSize, palette, fontFamily, colorAlternative } from "akeneo-design-system";

const appTheme: Theme = {
  name: "App Theme",
  color: {
    ...color,
    brand20: "#f0f7f1",
    brand40: "#e1f0e3",
    brand60: "#c2e1c7",
    brand80: "#a3d1ab",
    brand100: "#85c28f",
    brand120: "#67b373",
    brand140: "#528f5c",
  },
  colorAlternative,
  fontSize,
  palette,
  fontFamily,
};

export { appTheme };
