
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Header />

      <main className="w-full flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
