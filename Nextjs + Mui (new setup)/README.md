# To Hide/Disable Dev Tools for this project (N like icon on screen)
<!-- This is show only for dev mode, In next.config.ts file add: -->
devIndicators: false


# Mui installation in Nextjs:
    npm install @mui/material @emotion/react @emotion/styled @mui/material-nextjs
    npm install @mui/icons-material
(1) Create a ThemeRegistry.tsx in components and import in root layout // for mui + next
(2) Create a Theme (theme.ts) file in components and import in ThemeRegistry  // for default mode and color