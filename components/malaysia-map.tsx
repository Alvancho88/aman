"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getApiCategory } from "@/lib/malaysia-data"

interface MapMarker {
  name: string
  api: number
  lat: number
  lng: number
}

interface MalaysiaMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
  highlightArea?: string
}

export default function MalaysiaMap({ 
  markers, 
  center = [4.2105, 108.9758], // Center of Malaysia
  zoom = 6,
  onMarkerClick,
  highlightArea
}: MalaysiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return

    // Initialize the map
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      scrollWheelZoom: true,
    })

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    // Add zoom control to top-left
    L.control.zoom({ position: "topleft" }).addTo(map)

    mapInstanceRef.current = map

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isClient, center, zoom])

  // Add markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isClient) return

    const map = mapInstanceRef.current

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer)
      }
    })

    // Add markers for each location
    markers.forEach((marker) => {
      const category = getApiCategory(marker.api)
      const isHighlighted = marker.name === highlightArea

      const textColor = marker.api >= 200 ? "white" : "black";

      // Create custom HTML icon
      const iconHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="
            background-color: ${category.color};
            color: ${textColor};
            font-weight: bold;
            font-size: ${isHighlighted ? '16px' : '12px'};
            padding: ${isHighlighted ? '8px 12px' : '4px 8px'};
            border-radius: 6px;
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            ${isHighlighted ? 'outline: 3px solid rgba(14,165,233,0.9); outline-offset: 2px;' : ''}
          ">
            ${marker.api}
          </div>
          <div style="
            width: 3px;
            height: ${isHighlighted ? '16px' : '10px'};
            background-color: ${category.color};
          "></div>
          <div style="
            width: ${isHighlighted ? '12px' : '8px'};
            height: ${isHighlighted ? '12px' : '8px'};
            border-radius: 50%;
            background-color: ${category.color};
            border: 2px solid white;
          "></div>
        </div>
      `

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-marker",
        iconSize: [1, 1],
        iconAnchor: [0, 0],
      })

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <strong style="font-size: 16px; color: #0c4a6e;">${marker.name}</strong><br/>
            <span style="
              display: inline-block;
              margin-top: 8px;
              padding: 8px 16px;
              background-color: ${category.color};
              color: black;
              font-weight: bold;
              font-size: 24px;
              border-radius: 8px;
            ">${marker.api}</span><br/>
            <span style="
              display: inline-block;
              margin-top: 8px;
              color: ${category.color};
              font-weight: 600;
            ">${category.level}</span>
          </div>
        `, { className: 'custom-popup' })

      if (onMarkerClick) {
        leafletMarker.on("click", () => onMarkerClick(marker))
      }
    })
  }, [markers, isClient, onMarkerClick, highlightArea])

  // Update view when center/zoom changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isClient) return
    mapInstanceRef.current.setView(center, zoom)
  }, [center, zoom, isClient])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-sky-100 flex items-center justify-center">
        <div className="text-sky-600">Loading map...</div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}
