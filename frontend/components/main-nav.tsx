import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import logo from "../../Images/TEE-Shield-logo-2.png"
import { Home, User, Briefcase, FileText } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import Image from "next/image"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  // Pre-render the icons
  const navItems = [
    { 
      name: 'Home', 
      url: '/', 
      icon: <Home size={18} strokeWidth={2.5} /> 
    },
    { 
      name: 'Extension', 
      url: '/extension', 
      icon: <User size={18} strokeWidth={2.5} /> 
    },
    { 
      name: 'Examples', 
      url: '/examples', 
      icon: <Briefcase size={18} strokeWidth={2.5} /> 
    },
    { 
      name: 'Dashboard', 
      url: '/terminal', 
      icon: <FileText size={18} strokeWidth={2.5} /> 
    }
  ]

  return (
    <div className="flex gap-6 md:gap-10  my-2">
      <Link href="/" className="flex items-center space-x-2">
      <Image src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <NavBar items={navItems} />
    </div>
  )
}