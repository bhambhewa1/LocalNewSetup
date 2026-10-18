# To Hide/Disable Dev Tools for this project (N like icon on screen)
<!-- This is show only for dev mode, In next.config.ts file add: -->
devIndicators: false

# Mui installation in Nextjs:
    npm install @mui/material @emotion/react @emotion/styled @mui/material-nextjs
    npm install @mui/icons-material
(1) Create a ThemeRegistry.tsx in components and import in root layout // for mui + next
(2) Create a Theme (theme.ts) file in components and import in ThemeRegistry  // for default mode and color

# Socket connection
    "socket.io-client" is good for client side socket connectin instead of "WebSocket"
    "socket.io" for backend module
(1) npm install socket.io-client
(2) create a websocket component and setup a connection inside useEffect hook
(3) import this client component in the root page.tsx file

## From POSTMAN to Nextjs (client side websocket) is not testable. Because POSTMAN websocket/socket is client side, it can test the backend websocket/socket real time communication

