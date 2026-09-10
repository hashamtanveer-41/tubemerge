import React from "react"

interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  keywords?: string[]
}

export default function SEO({
  title = "TubeMerger — Turn Video Playlists into Seamless Masters | Free Video & Playlist Downloader",
  description = "Download YouTube playlists and videos with TubeMerger. Merge full playlists into seamless, high-quality masters with automatic chapter bookmarks and audio leveling. 100% free, open-source, and offline for all operating systems.",
  canonicalUrl = "https://tubemerger.com/",
  ogImage = "https://tubemerger.com/og-image.png",
  keywords = [
    "video playlist merger",
    "download youtube playlist",
    "merge youtube playlist",
    "youtube video downloader",
    "playlist downloader",
    "stitch videos offline",
    "video chapter generator",
    "local video merger",
    "Apple Silicon video merger",
    "batch video downloader",
    "youtube playlist combiner",
    "free video merger",
    "offline playlist downloader",
  ],
}: SEOProps) {
  React.useEffect(() => {
    // Dynamically update document title
    if (document.title !== title) {
      document.title = title
    }

    // Helper to safely set meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name"
      let meta = document.querySelector(
        `meta[${attr}="${name}"]`,
      ) as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    setMeta("description", description)
    setMeta("keywords", keywords.join(", "))
    setMeta("og:title", title, true)
    setMeta("og:description", description, true)
    setMeta("og:url", canonicalUrl, true)
    setMeta("og:image", ogImage, true)
    setMeta("twitter:title", title)
    setMeta("twitter:description", description)
    setMeta("twitter:image", ogImage)

    // Ensure canonical link exists
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [title, description, canonicalUrl, ogImage, keywords])

  return null
}
