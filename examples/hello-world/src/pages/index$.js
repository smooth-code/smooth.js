import React from 'react'
import { Link } from 'smooth/router'
import { createResource } from 'fretch'

const useResource = createResource(
  value =>
    new Promise(resolve => {
      setTimeout(() => resolve(value), 1000)
    }),
)

const SuspenseContext = React.createContext()

function SuspenseProvider({ children }) {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    setHydrated(true)
  }, [])
  return (
    <SuspenseContext.Provider value={hydrated}>
      {children}
    </SuspenseContext.Provider>
  )
}

function useHydrated() {
  return React.useContext(SuspenseContext)
}

function UniversalSuspense({ fallback, children }) {
  const hydrated = useHydrated()
  if (typeof window === 'undefined') {
    return children
  }
  return (
    <React.Suspense fallback={hydrated ? fallback : undefined}>
      {children}
    </React.Suspense>
  )
}

function Result({ value }) {
  const query = useResource(value)
  return query.data
}

function ClientOnly({ children }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? children : null
}

export default () => {
  return (
    <SuspenseProvider>
      <main>
        Hello World.
        <Result value="BOOM" />
        <UniversalSuspense fallback={<div>Fallback</div>}>
          <div>
            <ClientOnly>
              <Result value="BIM" />
            </ClientOnly>
          </div>
        </UniversalSuspense>
        <ClientOnly>
          <UniversalSuspense fallback={<div>Fallback</div>}>
            <Result value="PIF" />
          </UniversalSuspense>
        </ClientOnly>
        <Link to="/about">About</Link>
      </main>
    </SuspenseProvider>
  )
}
