"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Link>
            <h1 className="text-xl font-bold">API Documentation</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 py-8 docs-wrapper">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-4 md:p-8 overflow-hidden">
          {/* We load the swagger.json we created in the public folder */}
          <SwaggerUI url="/swagger.json" />
        </div>
      </main>
      
      {/* 
        Swagger UI forces light mode styles by default in its CSS. 
        We add a quick global style override here so it doesn't look totally broken in dark mode,
        but typically you'd use a dark-mode specific swagger css theme.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dark .swagger-ui {
          filter: invert(88%) hue-rotate(180deg);
        }
        .dark .swagger-ui .microlight {
          filter: invert(100%) hue-rotate(180deg);
        }
      `}} />
    </div>
  );
}
