"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

// BeamsBackground component from the second file
function BeamsBackground({ intensity = "medium" }) {
  const canvasRef = useRef(null);
  const beamsRef:any= useRef([]);
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
function ExampleSite({
  title,
  description,
  url,
  isMalicious,
  delay = 0,
}:any) {
  const handleClick = (e:any) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (

      <Card onClick={handleClick} className={`p-6 h-full rounded-xl cursor-pointer z-40 border-2 ${
        isMalicious ? "border-red-500/30 bg-red-950/10" : "border-green-500/30 bg-green-950/10"
      } transition-all duration-300 group relative`}>

        <div className="flex items-start gap-4 relative z-10">
          <div className={`p-3 rounded-lg ${isMalicious ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
            {isMalicious ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white/90 mb-2 flex items-center gap-2">
              {title}
              <span className={`text-xs px-2 py-0.5 rounded-full ${isMalicious ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}>
                {isMalicious ? "Compromised" : "Secure"}
              </span>
            </h3>

            <p className="text-white/60 text-sm mb-4">{description}</p>


          </div>
        </div>

        {/* Move the decorative element below content and ensure it doesn't block interactions */}
        {/* <div
          className={`absolute top-0 right-0 w-20 h-20 -translate-y-10 translate-x-10 rounded-full blur-2xl z-0 ${
            isMalicious ? "bg-red-500/20" : "bg-green-500/20"
          }`}
        /> */}
      </Card>

  );
}
export default function ExamplesPage() {
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
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-white/70 tracking-wide">
              Extension Testing
            </span>
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
        >
          Test TEE Shield
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="text-lg text-white/60 max-w-2xl mb-8"
        >
          Experience how our extension works by visiting these test sites. See real-time detection of compromised dApp frontends and explore the secure experience.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
        >
          <Alert className="mb-8 border-blue-500/30 bg-blue-900/20 backdrop-blur-md">
            <Download className="h-5 w-5 text-blue-300" />
            <AlertTitle className="text-blue-300">Haven't installed the extension yet?</AlertTitle>
            <AlertDescription className="text-blue-200/70">
              <Link href="/extension" className="underline hover:text-blue-300">
                Navigate to /extension
              </Link>{" "}
              to download and install our protection before testing.
            </AlertDescription>
          </Alert>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <ExampleSite
            title="Secure Safe Global App"
            description="This is a legitimate dApp with verified frontend integrity. Our extension will confirm the site is secure and allow normal interaction."
            url="http://3.7.119.251:3000"
            isMalicious={false}
            delay={0.4}
          />

          <ExampleSite
            title="Compromised Safe Global App"
            description="This simulates a compromised frontend. Our extension will detect the tampering and alert you before any interaction can occur."
            url="https://eth-global-trifecta-2025-m5uz.vercel.app"
            isMalicious={true}
            delay={0.4}
          />
        </div>

        <motion.div
          custom={5}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center"
        >
          <h2 className="text-xl md:text-2xl font-medium mb-6 text-white/80">How Does The Protection Work?</h2>

          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6 text-white/60">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="bg-blue-500/10 text-blue-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">1</div>
              <h3 className="text-white/90 font-medium mb-2">Hash Verification</h3>
              <p className="text-sm">Smart contracts store cryptographic hashes of legitimate frontend code.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="bg-indigo-500/10 text-indigo-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">2</div>
              <h3 className="text-white/90 font-medium mb-2">Real-time Checks</h3>
              <p className="text-sm">Our extension compares loaded website code against on-chain verification.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="bg-purple-500/10 text-purple-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">3</div>
              <h3 className="text-white/90 font-medium mb-2">Instant Protection</h3>
              <p className="text-sm">Receive immediate alerts before any interaction with compromised sites.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
