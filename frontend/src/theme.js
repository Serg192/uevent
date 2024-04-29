export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#F2E6FF",
    100: "#DFB3FF",
    200: "#CC80FF",
    300: "#B94DFF",
    400: "#A619FF",
    500: "#9300E6",
    600: "#7A00B4",
    700: "#610080",
    800: "#47004D",
    900: "#2E0020",
  },
};

export const themeSettings = () => {
  return {
    palette: {
      mode: "light",
      ...{
        primary: {
          dark: colorTokens.primary[700],
          main: colorTokens.primary[500],
          light: colorTokens.primary[50],
        },
        neutral: {
          dark: colorTokens.grey[700],
          main: colorTokens.grey[500],
          mediumMain: colorTokens.grey[400],
          medium: colorTokens.grey[300],
          light: colorTokens.grey[50],
        },
        background: {
          default: colorTokens.grey[10],
          alt: colorTokens.grey[0],
        },
      },
    },
    typography: {
      fontFamily: ["sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
