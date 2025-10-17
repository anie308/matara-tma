import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './services/store.ts';
import { TonConnectUIProvider } from '@tonconnect/ui-react';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl='https://matara-tma.vercel.app/tonconnect-manifest.json'>
        <BrowserRouter>
          <Provider store={store}>
            <App />
            <Toaster
              toastOptions={{
                position: "top-center",
                style: {
                  color: "#fff",
                  fontSize: "14px",
                  padding: "10px 15px",
                  background: "#023A27",
                },
              }}
            />
          </Provider>
        </BrowserRouter>
    </TonConnectUIProvider>
  </StrictMode>,
)
