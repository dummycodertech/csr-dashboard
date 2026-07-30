import { ThemeProvider } from './context/ThemeContext'
import { FilterProvider } from './context/FilterContext'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/Dashboard'
import { ErrorBoundary } from './ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FilterProvider>
          <div className="flex h-screen bg-canvas text-tx-body overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6">
                <Dashboard />
              </main>
            </div>
          </div>
        </FilterProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

