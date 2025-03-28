import { useEffect, useRef } from 'react';
import './GradientBackground.css';

const GradientBackground = () => {
  const particlesContainerRef = useRef(null);

  useEffect(() => {
    const createParticles = () => {
      if (!particlesContainerRef.current) return;
      
      const container = particlesContainerRef.current;
      container.innerHTML = '';
      
      const particleCount = 15; // Reduced particle count for better performance
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size (smaller particles)
        const size = Math.random() * 1.5 + 0.5;
        
        // Style the particle
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation delay and duration
        const animDuration = Math.random() * 15 + 10;
        const animDelay = Math.random() * 5;
        
        particle.style.animation = `float-particle ${animDuration}s ease-in-out ${animDelay}s infinite alternate`;
        particle.style.opacity = Math.random() * 0.3 + 0.05;
        
        container.appendChild(particle);
      }
    };
    
    createParticles();
    
    // Recreate particles on window resize for better distribution
    window.addEventListener('resize', createParticles);
    
    return () => {
      window.removeEventListener('resize', createParticles);
    };
  }, []);
  
  return (
    <div className="gradient-background">
      <div className="gradient-sphere sphere-1"></div>
      <div className="gradient-sphere sphere-2"></div>
      <div className="gradient-sphere sphere-3"></div>
      <div className="grid-overlay"></div>
      <div className="glow"></div>
      <div className="particles-container" ref={particlesContainerRef}></div>
      <div className="noise-overlay"></div>
    </div>
  );
};

export default GradientBackground; 






// import React, { useState } from 'react'
// import axios from 'axios'

// export default function InputForm({setIsOpen}) {
//    const [email,setEmail]=useState("")
//    const [password,setPassword]=useState("")
//    const [isSignUp,setIsSignUp]=useState(false) 
//    const [error,setError]=useState("")

//   const handleOnSubmit=async(e)=>{
//     e.preventDefault()
//     let endpoint=(isSignUp) ? "signUp" : "login"
//     await axios.post(`http://localhost:5000/${endpoint}`,{email,password})
//     .then((res)=>{
//         localStorage.setItem("token",res.data.token)
//         localStorage.setItem("user",JSON.stringify(res.data.user))
//         setIsOpen()
//     })
//     .catch(data=>setError(data.response?.data?.error))
//   }

