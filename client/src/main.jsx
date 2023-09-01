import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import App from './App.jsx'
// import authContext from "./contexts/authContext"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{ colorScheme: 'dark' }}>
        <Notifications />
          {/* <authContext.Provider> */}
            <App />
          {/* </authContext.Provider> */}
        </MantineProvider>
    </React.StrictMode>,
)
