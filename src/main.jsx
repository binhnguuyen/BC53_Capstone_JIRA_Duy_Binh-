import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import '@fontsource-variable/nunito-sans';
import { Provider } from 'react-redux';
import { store } from './redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fontsource-variable/nunito-sans';

const queryClient = new QueryClient({
  defaultOptions: {
      queries: {
          refetchOnWindowFocus: false, // default: true
          // call api after user returns from another tab
      }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
  
)
