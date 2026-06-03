// src/App.jsx

import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { NFCScannerProvider } from './contexts/NFCScannerContext';

function App() {
  return (
    <NFCScannerProvider autoStart={true} showGlobalStatus={true}>
      <RouterProvider router={router} />
    </NFCScannerProvider>
  )
}

export default App