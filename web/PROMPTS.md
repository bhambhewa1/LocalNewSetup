## AI Prompts for setup a mui with nextjs integration:
(1) npm install @mui/material @emotion/react @emotion/styled
(2) npm install @mui/icons-material @mui/material-nextjs
(3) src/theme/theme.ts :
    'use client'
    import { createTheme } from '@mui/material/styles'
    const theme = createTheme({
    palette: {
        mode: 'light'
    }
    })
    export default theme 
(4) src/components/ThemeRegistry.tsx : 
        import type { Metadata } from 'next'
        import ThemeRegistry from '@/components/ThemeRegistry'

        export const metadata: Metadata = {
        title: 'Next MUI App',
        description: 'Generated with Next.js and MUI'
        }

        export default function RootLayout({
        children
        }: Readonly<{
        children: React.ReactNode
        }>) {
        return (
            <html lang="en">
            <body>
                <ThemeRegistry>
                {children}
                </ThemeRegistry>
            </body>
            </html>
        )
        }


## AI Prompts for setup a websocket stable connection:

(1) A frontend (nextjs) websocket connection issue when connecting:

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected");
    };

    ws.onmessage = (event) => {
      console.log("Message:", event.data);

      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);



(2) WebSocket connection to 'ws://localhost:8080/' failed
  const [messages, setMessages] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
    setMounted(true);

    const ws = new WebSocket("ws://127.0.0.1:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);



  ### Error gives for a client component in Nextjs from postman:
  # Postman getting error on connection:
  Error: connect ECONNREFUSED 127.0.0.1:8081
  Handshake Details::
  Request URL: http://localhost:8081/
  Request Method: GET
  Request Headers
  Sec-WebSocket-Version: 13
  Sec-WebSocket-Key: f4vOc8OU6kcwFMTYBvEfSg==
  Connection: Upgrade
  Upgrade: websocket
  Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
  Host: localhost:8081


  # From Frontend issue getting:
  (1) WebSocket connection to 'ws://localhost:8081/socket.io/?EIO=4&transport=websocket' failed: 
  (2) http://localhost:3000/socket.io?EIO=4&transport=polling&t=7zyerixu 404 (Not Found)


  ## At the end (socket-io-client) module is working fine instead of Websocket method for frontend websocket connection, issue fixed.