"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Code2,
  Layers,
  Sparkles,
  Type,
  ImageIcon,
  Film,
  Clock,
  Check,
} from "lucide-react";
import { MarketingNav } from "./MarketingNav";
import { ContactSection } from "./ContactSection";
import { Logo } from "./Logo";
import { SITE, MODES, MARKETING_MODELS, COMPARISON } from "@/lib/marketing";
import { analytics } from "@/lib/analytics";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <div className="grain pointer-events-none fixed inset-0 z-[100] opacity-[0.35]" />
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28">
        <HeroBackground />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary-light mb-8">
                <Zap className="w-3.5 h-3.5" />
                Direct BytePlus ModelArk · Zero reseller markup
              </div>

              <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.05] mb-6">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-violet-400">
                  cheapest
                </span>{" "}
                Seedance API
              </h1>

              <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-10 max-w-xl">
                {SITE.description.split(".")[0]}. Generate cinematic AI video
                from text, images, or references — starting around{" "}
                <strong className="text-text font-semibold">$0.60 per 5s clip</strong>{" "}
                on Seedance 2.0. No credits. No subscription. Pay per token.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="#access"
                  onClick={() => analytics.heroCtaClick("request_access")}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-primary/30 text-base"
                >
                  Request API Access
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#models"
                  onClick={() => analytics.heroCtaClick("explore_models")}
                  className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-primary/40 bg-white/[0.03] hover:bg-white/[0.06] text-text font-semibold px-8 py-4 rounded-2xl transition-all text-base"
                >
                  Explore models
                </a>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-text-dim">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  6 Seedance models live
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  2.5 coming soon
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  REST API + Studio
                </span>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-violet-600/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
                <Image
                  src="/marketing/hero-mockup.png"
                  alt="Xethra Seedance API platform preview"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <FloatingStat
                className="absolute -left-4 top-1/4 hidden lg:block"
                label="5s · 720p clip"
                value="~$0.76"
                sub="Seedance 2.0"
              />
              <FloatingStat
                className="absolute -right-2 bottom-1/4 hidden lg:block"
                label="vs Kie.ai"
                value="−26%"
                sub="same generation"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/[0.06] bg-surface/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-text-dim">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Direct ByteDance infrastructure
          </span>
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            Production-ready REST API
          </span>
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Text · Image · Reference modes
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Seedance 2.5 waitlist open
          </span>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Generation modes"
            title="Three ways to create"
            description="Every mode runs on the same direct Seedance API — choose based on your input, not your budget."
          />

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {MODES.map((mode, i) => (
              <ModeCard key={mode.id} mode={mode} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Studio preview */}
      <section id="studio" className="py-28 scroll-mt-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-6 bg-primary/10 rounded-3xl blur-3xl" />
              <Image
                src="/marketing/studio-mockup.png"
                alt="Xethra AI video studio interface"
                width={1400}
                height={900}
                className="relative rounded-2xl border border-white/[0.08] shadow-2xl w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                eyebrow="Visual studio"
                title="Test before you scale"
                description="Every API customer gets access to our private studio — generate videos in the browser, see real-time cost estimates, track job history, and download outputs. No BytePlus console required."
                align="left"
              />
              <ul className="mt-8 space-y-4">
                {[
                  "Live cost calculator per model & duration",
                  "Job history with status sync & activity logs",
                  "Image upload or URL for I2V campaigns",
                  "Agent-ready API for automated batch production",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-text-muted">
                    <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                onClick={() => analytics.ctaClick("Sign in to Studio", "studio_section")}
                className="inline-flex items-center gap-2 mt-10 text-primary hover:text-primary-light font-semibold text-sm transition-colors"
              >
                Sign in to Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Models */}
      <section id="models" className="py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Model catalog"
            title="Every Seedance model. One API."
            description="From free-tier testing on 1.0 Pro Fast to flagship Seedance 2.0 production — plus Face variants for avatar campaigns. Seedance 2.5 is on the roadmap."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            {MARKETING_MODELS.map((model) => (
              <ModelCard key={model.name} model={model} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section id="pricing" className="py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Transparent pricing"
            title="Why direct beats resellers"
            description="Same Seedance 2.0 generation — 5 seconds, 720p, image input. Here's what 100 clips actually cost."
          />

          <div className="mt-16 overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-text-dim">
                  <th className="px-6 py-4 font-medium">Platform</th>
                  <th className="px-6 py-4 font-medium">Per 5s clip</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Per second</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">vs direct</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">API</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.platform}
                    className={
                      row.highlight
                        ? "bg-primary/10 border-b border-primary/20"
                        : "border-b border-white/[0.04] last:border-0"
                    }
                  >
                    <td className="px-6 py-5 font-medium text-text">
                      {row.platform}
                      {row.highlight && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                          You are here
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-text-muted font-mono">{row.perClip}</td>
                    <td className="px-6 py-5 text-text-dim hidden md:table-cell font-mono text-xs">
                      {row.perSec}
                    </td>
                    <td className="px-6 py-5 text-text-dim hidden sm:table-cell">{row.markup}</td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      {row.api ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <span className="text-text-dim">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-text-dim mt-6 max-w-3xl mx-auto leading-relaxed">
            Benchmark: Seedance 2.0 · 5s · 720p · 9:16 · image/text input (no reference video).
            Xethra = BytePlus pay-as-you-go at $7.0/M tokens (~108K tokens/clip).
            Reseller rates from public docs (fal.ai, Kie.ai, WaveSpeed, Replicate, Segmind)
            and consumer plans (Higgsfield, Dreamina) as of Apr–Jun 2026. Not affiliated with listed platforms.
          </p>
        </div>
      </section>

      {/* Features bento */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Platform"
            title="Built for production teams"
            description="Not a wrapper. A full video generation stack with observability, automation, and honest pricing."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
            <BentoCard
              icon={<Clock className="w-5 h-5" />}
              title="Real-time job tracking"
              description="Poll status, sync history, and activity logs — see every generation in the studio dashboard."
              className="md:col-span-2"
            />
            <BentoCard
              icon={<Code2 className="w-5 h-5" />}
              title="Agent API"
              description="Automate batch campaigns with a dedicated agent endpoint and persistent job storage."
            />
            <BentoCard
              icon={<Zap className="w-5 h-5" />}
              title="2M free tokens"
              description="Start on Seedance 1.0 / 1.5 Pro Fast with free quota before scaling to 2.0."
            />
            <BentoCard
              icon={<Film className="w-5 h-5" />}
              title="All aspect ratios"
              description="9:16 for Reels, 16:9 for YouTube, 1:1 for feeds — one API, every format."
              className="md:col-span-2"
            />
          </div>
        </div>
      </section>

      <ContactSection />

      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" location="footer" />
          <p className="text-xs text-text-dim text-center">
            © {new Date().getFullYear()} Xethra · Direct Seedance API via BytePlus ModelArk
          </p>
          <div className="flex gap-6 text-xs text-text-dim">
            <a
              href="#pricing"
              onClick={() => analytics.footerLinkClick("Pricing")}
              className="hover:text-text transition-colors"
            >
              Pricing
            </a>
            <a
              href="#access"
              onClick={() => analytics.footerLinkClick("Contact")}
              className="hover:text-text transition-colors"
            >
              Contact
            </a>
            <Link
              href="/login"
              onClick={() => analytics.footerLinkClick("Studio")}
              className="hover:text-text transition-colors"
            >
              Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        }}
      />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-xl"}>
      <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
        {title}
      </h2>
      <p className="text-lg text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

const modeIcons = {
  text: Type,
  image: ImageIcon,
  reference: Film,
};

function ModeCard({
  mode,
  index,
}: {
  mode: (typeof MODES)[number];
  index: number;
}) {
  const Icon = modeIcons[mode.id as keyof typeof modeIcons];
  return (
    <div
      className="group relative rounded-2xl border border-white/[0.08] bg-surface/40 p-8 hover:border-primary/30 hover:bg-surface/60 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-text mb-1">{mode.title}</h3>
      <p className="text-sm text-primary-light font-medium mb-4">{mode.headline}</p>
      <p className="text-sm text-text-muted leading-relaxed mb-6">{mode.description}</p>
      <ul className="space-y-2">
        {mode.details.map((d) => (
          <li key={d} className="text-xs text-text-dim flex items-start gap-2">
            <span className="text-primary mt-1">·</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModelCard({ model }: { model: (typeof MARKETING_MODELS)[number] }) {
  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all ${
        model.available
          ? "border-white/[0.08] bg-surface/40 hover:border-primary/25"
          : "border-primary/20 bg-gradient-to-br from-primary/10 to-transparent"
      }`}
    >
      {!model.available && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2.5 py-1 rounded-full">
          Coming soon
        </span>
      )}
      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
        {model.tier}
      </p>
      <h3 className="text-lg font-semibold text-text mb-4">{model.name}</h3>
      <div className="space-y-2 text-sm mb-5">
        <div className="flex justify-between">
          <span className="text-text-dim">Token rate</span>
          <span className="text-text-muted font-mono text-xs">{model.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-dim">~5s clip</span>
          <span className="text-text font-semibold">{model.perClip}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-dim">Resolution</span>
          <span className="text-text-muted">{model.resolution}</span>
        </div>
      </div>
      <p className="text-xs text-text-dim border-t border-white/[0.06] pt-4">
        {model.highlight}
      </p>
    </div>
  );
}

function BentoCard({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-surface/30 p-6 hover:bg-surface/50 transition-colors ${className ?? ""}`}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function FloatingStat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-bg/90 backdrop-blur-xl px-4 py-3 shadow-xl ${className}`}
    >
      <p className="text-[10px] text-text-dim uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-text font-display">{value}</p>
      <p className="text-[10px] text-primary">{sub}</p>
    </div>
  );
}
