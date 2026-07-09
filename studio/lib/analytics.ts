import { track } from "@vercel/analytics";

export const analytics = {
  navClick(label: string, location: "desktop" | "mobile") {
    track("Nav Click", { label, location });
  },

  logoClick(location: "nav" | "footer") {
    track("Logo Click", { location });
  },

  mobileMenuToggle(action: "open" | "close") {
    track("Mobile Menu", { action });
  },

  heroCtaClick(cta: "request_access" | "explore_models") {
    track("Hero CTA Click", { cta });
  },

  ctaClick(label: string, location: string) {
    track("CTA Click", { label, location });
  },

  footerLinkClick(label: string) {
    track("Footer Link Click", { label });
  },

  contactFormStart() {
    track("Contact Form Start");
  },

  contactFormSubmit(useCase?: string) {
    track("Contact Form Submit", { use_case: useCase || "unspecified" });
  },

  contactFormError(message: string) {
    track("Contact Form Error", { error: message.slice(0, 120) });
  },

  loginSubmit() {
    track("Login Submit");
  },

  loginError() {
    track("Login Error");
  },
};
