import React from 'react'

export default function Modal(props) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={props.onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-6 z-50 w-full max-w-md">
        {props.children}
      </div>
    </>
  )
}
