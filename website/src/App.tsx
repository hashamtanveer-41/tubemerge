import React, { useState, useEffect } from "react"
import SEO from "@/components/SEO"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Showcase from "@/components/Showcase"
import FeatureCards from "@/components/FeatureCards"
import ComparisonTable from "@/components/ComparisonTable"
import PricingSection from "@/components/PricingSection"
import FaqSection from "@/components/FaqSection"
import Footer from "@/components/Footer"
import DownloadPage from "@/pages/DownloadPage"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  // Handle client-side routing between Home and dedicated Download Page
  const [currentView, setCurrentView] = useState<"home" | "download">(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase()
      const hash = window.location.hash.toLowerCase()
      if (
        path === "/download" ||
        hash === "#download" ||
        hash === "#/download"
      ) {
        return "download"
      }
    }
    return "home"
  })

  // Listen to browser navigation (Back / Forward) and hash changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase()
      const hash = window.location.hash.toLowerCase()
      if (
        path === "/download" ||
        hash === "#download" ||
        hash === "#/download"
      ) {
        setCurrentView("download")
      } else {
        setCurrentView("home")
      }
    }

    window.addEventListener("popstate", handlePopState)
    window.addEventListener("hashchange", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("hashchange", handlePopState)
    }
  }, [])

  // Navigation handlers
  const navigateToDownload = () => {
    setCurrentView("download")
    try {
      if (window.location.pathname !== "/download") {
        window.history.pushState(null, "", "/download")
      }
    } catch {
      window.location.hash = "#download"
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navigateToHome = () => {
    setCurrentView("home")
    try {
      if (window.location.pathname !== "/") {
        window.history.pushState(null, "", "/")
      }
    } catch {
      window.location.hash = ""
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navigateToCommunity = () => {
    setCurrentView("home")
    try {
      if (window.location.pathname !== "/") {
        window.history.pushState(null, "", "/#community")
      }
    } catch {
      window.location.hash = "#community"
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      const el = document.getElementById("community")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }, 120)
  }

  return (
    <>
      {currentView === "download" ? (
        <>
          {/* Download Page SEO */}
          <SEO
            title="Download TubeMerger — 100% Free & Open Source Video & Playlist Downloader"
            description="Download TubeMerger native desktop application for all operating systems. Download YouTube playlists and videos offline with fast local processing."
            canonicalUrl="https://tubemerger.com/download"
          />

          {/* Dedicated Download Page */}
          <DownloadPage
            onNavigateHome={navigateToHome}
            onNavigateToCommunity={navigateToCommunity}
          />
        </>
      ) : (
        <div className="min-h-screen bg-canvas text-white selection:bg-coral/30 selection:text-white flex flex-col">
          {/* Home Page SEO */}
          <SEO
            title="TubeMerger — Turn Video Playlists into Seamless Masters | Free Video & Playlist Downloader"
            description="Download YouTube playlists and videos with TubeMerger. Merge full playlists into seamless, high-quality masters with automatic chapter bookmarks and audio leveling. 100% free, open-source, and offline for all operating systems."
            canonicalUrl="https://tubemerger.com/"
          />

          {/* Solid Global Header */}
          <Navbar onOpenDownload={navigateToDownload} />

          {/* Main Content Sections */}
          <main id="main-content" role="main" className="flex-1">
            <Hero onOpenDownload={navigateToDownload} />

            <Showcase />

            <FeatureCards />

            <ComparisonTable />

            <PricingSection onOpenDownload={navigateToDownload} />

            <FaqSection />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      )}

      {/* Vercel Web Analytics & Real User Monitoring */}
      <Analytics />
      <SpeedInsights />
    </>
  )
}
