"use client";

import { motion } from "framer-motion";
import { AlertCircle, Download, Shield, Settings, Code, Server, CheckCircle, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { saveAs } from 'file-saver';
// BeamsBackground component (reused from examples page)
function BeamsBackground({ intensity = "medium" }) {
  const canvasRef = useRef(null);
  const beamsRef:any = useRef([]);
  const animationFrameRef = useRef(0);
  const MINIMUM_BEAMS = 20;

  const opacityMap:any = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  };

  useEffect(() => {
    const canvas:any = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function createBeam(width:any, height:any) {
      const angle = -35 + Math.random() * 10;
      return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle: angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.16,
        hue: 190 + Math.random() * 70,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      };
    }

    function resetBeam(beam:any, index:any, totalBeams:any) {
      if (!canvas) return beam;
      
      const column = index % 3;
      const spacing = canvas.width / 3;

      beam.y = canvas.height + 100;
      beam.x =
        column * spacing +
        spacing / 2 +
        (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(ctx:any, beam:any) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      // Calculate pulsing opacity
      const pulsingOpacity =
        beam.opacity *
        (0.8 + Math.sin(beam.pulse) * 0.2) *
        opacityMap[intensity];

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

      // Enhanced gradient with multiple color stops
      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
      gradient.addColorStop(
        0.1,
        `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
      );
      gradient.addColorStop(
        0.4,
        `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
      );
      gradient.addColorStop(
        0.6,
        `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
      );
      gradient.addColorStop(
        0.9,
        `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
      );
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(35px)";

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam:any, index:any) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ filter: "blur(15px)" }}
      />
      <motion.div
        className="absolute inset-0 bg-neutral-950/5"
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(50px)",
        }}
      />
    </div>
  );
}

// Installation Step component
function InstallationStep({ number, title, description, icon, delay = 0 }:any) {
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3 + delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const Icon = icon;

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden group"
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="bg-indigo-500/10 text-indigo-400 w-12 h-12 rounded-full flex items-center justify-center mb-4">
        <Icon size={24} />
      </div>
      <div className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold">
        {number}
      </div>
      <h3 className="text-white/90 font-medium text-lg mb-2">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </motion.div>
  );
}


function WorkflowStep({ number, title, description, icon }:any) {
  const Icon = icon;
  
  return (
    <div className="flex items-start gap-4 group">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 z-10 relative">
          <Icon size={20} />
        </div>
        {number < 5 && (
          <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-blue-500/20 -translate-x-1/2 group-hover:bg-blue-500/30 transition-colors" />
        )}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-white/90 font-medium mb-1">{title}</h3>
        <p className="text-white/60 text-sm mb-6">{description}</p>
      </div>
    </div>
  );
}

export default function ExtensionPage() {
  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i:any) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };



// Then update the downloadExtension function
const downloadExtension = () => {
  console.log("Extension download initiated");
  // Use file-saver to trigger the download
  // The first parameter is the file path, the second is the download filename
  saveAs("/build.zip", 'tee-shield-extension.zip');
};
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <BeamsBackground intensity="medium" />
      
      {/* Additional background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-80 w-80 rounded-full bg-purple-600/10 blur-3xl -top-20 -left-20" />
        <div className="absolute h-60 w-60 rounded-full bg-blue-600/10 blur-3xl top-1/4 right-10" />
        <div className="absolute h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl bottom-20 -right-20" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] opacity-5" />
        
        {/* Shine effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          custom={0}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="mb-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm text-white/70 tracking-wide">
              Extension
            </span>
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl md:text-6xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
        >
          TEE Shield Extension
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="text-lg text-white/60 max-w-3xl mb-6"
        >
          Protect yourself from compromised dApp frontends with our Chrome extension. 
          Verify the integrity of Web3 applications and browse with confidence.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <Button 
            onClick={downloadExtension}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300"
          >
            <Download className="h-5 w-5" />
            Download Extension
          </Button>
          
          <Link href="/examples">
            <Button variant="outline" className="px-8 py-6 text-lg rounded-xl border-white/20 text-white/80 hover:bg-white/5 hover:border-white/30 transition-all duration-300">
              View Demo
            </Button>
          </Link>
        </motion.div>


        {/* Installation Instructions */}
        <motion.div
          custom={6}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8 text-white/90">Installation Instructions</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InstallationStep
              number="1"
              title="Download Extension"
              description="Click the download button above to get the extension build folder as a ZIP file."
              icon={Download}
              delay={0}
            />
            
            <InstallationStep
              number="2"
              title="Open Extensions Page"
              description="Open Chrome and navigate to chrome://extensions/ in your browser."
              icon={Settings}
              delay={0.1}
            />
            
            <InstallationStep
              number="3"
              title="Enable Developer Mode"
              description="Toggle 'Developer mode' in the top-right corner of the extensions page."
              icon={Code}
              delay={0.2}
            />
            
            <InstallationStep
              number="4"
              title="Load Extension"
              description="Click 'Load unpacked' and select the build folder from the downloaded ZIP."
              icon={CheckCircle}
              delay={0.3}
            />
          </div>
        </motion.div>
        {/* How It Works */}
        <motion.div
          custom={5}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-8 text-white/90">How TEE Shield Works</h2>
          
          <div className="relative ">
            <WorkflowStep 
              number={1} 
              title="Developer Hash Commitment" 
              description="The developers of the dApp commit the hash of the frontend into a public verified smart contract on-chain through our dashboard."
              icon={Code}
            />
            
            <WorkflowStep 
              number={2} 
              title="User Protection" 
              description="End users install the Google Chrome extension to verify the integrity of Web3 frontends."
              icon={Shield}
            />
            
            <WorkflowStep 
              number={3} 
              title="Trusted Execution Environment" 
              description="User visits the dApp (e.g. Safe Global) front-end site running inside a TEE for additional security."
              icon={Lock}
            />
            
            <WorkflowStep 
              number={4} 
              title="Continuous Verification" 
              description="The Chrome extension periodically fetches the verified hash from the smart contract and compares it with the current frontend."
              icon={Server}
            />
            
            <WorkflowStep 
              number={5} 
              title="User Alerts" 
              description="If the hashes match, the site is confirmed safe. If they don't match, the extension alerts the user that the frontend has been tampered with."
              icon={AlertCircle}
            />
          </div>
        </motion.div>


     
      </div>
    </div>
  );
}