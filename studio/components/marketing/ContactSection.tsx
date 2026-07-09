"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, X } from "lucide-react";
import { clsx } from "clsx";
import { analytics } from "@/lib/analytics";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [useCase, setUseCase] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [started, setStarted] = useState(false);

  function handleFormStart() {
    if (started) return;
    setStarted(true);
    analytics.contactFormStart();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, useCase, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      analytics.contactFormSubmit(useCase);
      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setUseCase("");
      setMessage("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      analytics.contactFormError(msg);
      setStatus("error");
      setErrorMsg(msg);
    }
  }

  return (
    <section id="access" className="relative py-28 scroll-mt-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
              Get started
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Request API access
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-lg">
              Xethra is a direct BytePlus ModelArk integration — no middleman,
              no credit games. Tell us about your use case and we&apos;ll get you
              set up with API credentials and studio access.
            </p>
            <ul className="space-y-4">
              {[
                "Direct Seedance pricing — save 30–70% vs resellers",
                "Full model catalog: 1.0, 1.5, 2.0 + 2.5 waitlist",
                "REST API + visual studio for testing",
                "Priority onboarding for production campaigns",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-primary/10" />
            <div className="relative bg-surface/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 shadow-2xl">
              {status === "success" ? (
                <SuccessState onReset={() => setStatus("idle")} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Name" required>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={handleFormStart}
                        required
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleFormStart}
                        required
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <Field label="Company">
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company or project name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Use case">
                    <select
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      className={clsx(inputClass, "appearance-none cursor-pointer")}
                    >
                      <option value="">Select one…</option>
                      <option value="marketing">Marketing / ads</option>
                      <option value="avatar">Avatar / UGC videos</option>
                      <option value="product">Product visualization</option>
                      <option value="agency">Agency / client work</option>
                      <option value="saas">SaaS integration</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Message" required>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={handleFormStart}
                      required
                      rows={4}
                      placeholder="Tell us about your volume, timeline, and what you want to build…"
                      className={clsx(inputClass, "resize-none")}
                    />
                  </Field>

                  {status === "error" && (
                    <p className="text-sm text-error bg-error/10 border border-error/20 rounded-xl px-4 py-3">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold rounded-xl py-4 text-sm transition-all shadow-lg shadow-primary/25"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send access request
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-text-dim">
                    We typically respond within 24 hours. Your details stay private.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">Request sent</h3>
      <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
        Thanks for reaching out. We&apos;ll review your request and get back to you shortly with API access details.
      </p>
      <button
        onClick={onReset}
        className="text-sm text-primary hover:text-primary-light font-medium"
      >
        Send another request
      </button>
    </div>
  );
}

const inputClass =
  "w-full bg-bg/80 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text placeholder-text-dim focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors";
