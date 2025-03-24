import React from 'react'

export default function Footer() {
  return (
    <footer className="py-6 px-4 bg-black/30 backdrop-blur-md text-center text-gray-400">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} Food Recipe App - All rights reserved</p>
      </div>
    </footer>
  )
}
