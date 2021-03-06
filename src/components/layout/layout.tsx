import type { ReactNode } from 'react'
import Navbar from './navbar'
import Footer from './footer'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="layout">
            <Navbar />
            <main className="layout__main">{children}</main>
            <Footer />
        </div>
    )
}

export default Layout