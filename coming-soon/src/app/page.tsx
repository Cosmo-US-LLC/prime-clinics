"use client";

import { useState } from "react";
import Image from "next/image";

const SERVICE_CARDS = [
  { label: "Physical Health", image: "/images/card-physical-health.jpg" },
  { label: "Hormone Health", image: "/images/card-hormone-health.jpg" },
  { label: "Intimate Health", image: "/images/card-intimate-health.jpg" },
  { label: "Regenerative Aesthetics", image: "/images/card-regenerative.png" },
  { label: "Weight Management", image: "/images/card-weight.png" },
  { label: "Mental Fitness", image: "/images/card-mental.png" },
  { label: "Joint Rehabilitation", image: "/images/card-joint.png" },
];


export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const apiUrl = apiBase
        ? `${apiBase.replace(/\/$/, "")}/api/save-response/coming-soon`
        : "/api/save-response/coming-soon";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setStatus("error");
    }
  }

  return (
    <main className="h-[100dvh] p-2">
      <div className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col">
        {/* Background Image — Desktop */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/images/hero-bg.png"
            alt="Prime Clinics billboard"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0">
            <Image
              src="/images/hero-billboard.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Background Image — Mobile */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/hero-mobile.png"
            alt="Prime Clinics"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent hidden md:block" />

        {/* Logo — top left */}
        <div className="relative z-20 px-4 md:px-[60px] py-4 shrink-0">
          <div className="hidden md:block relative w-[112px] h-[56px]">
            <Image
              src="/images/logo.svg"
              alt="Prime Clinics"
              fill
              className="object-contain"
            />
          </div>
          <div className="md:hidden relative w-[80px] h-[40px]">
            <Image
              src="/images/logo-mobile.svg"
              alt="Prime Clinics"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Content area — fills remaining space */}
        <div className="relative z-10 flex-1 flex flex-col px-4 md:px-[60px] pb-6 md:pb-8">
          {/* Spacer — pushes content to ~40% from top (matching Figma) */}
          <div className="flex-[2]" />

          {/* Main content block */}
          <div className="max-w-[1300px] w-full">
            {/* Heading */}
            <div className="text-white mb-2 md:mb-4">
              <p className="font-oswald font-bold uppercase text-[20px] md:text-[24px] leading-[28px] md:leading-[32px]">
                Step into your prime
              </p>
              <h1 className="font-oswald font-bold uppercase text-[48px] md:text-[64px] leading-[56px] md:leading-[72px]">
                Opening This Spring
              </h1>
            </div>

            {/* Description */}
            <p className="text-white font-bold md:font-semibold text-[16px] md:text-[20px] leading-[24px] md:leading-[28px] mb-4 md:mb-6 max-w-[335px] md:max-w-none">
              Be the first to know! Enter your email for the latest updates on
              our opening.
            </p>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
              {status === "success" ? (
                <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-6 py-4 max-w-[382px]">
                  <p className="text-white font-semibold text-[16px]">
                    Thanks! We&apos;ll notify you when we open.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-white rounded-lg p-[6px] md:p-2 flex items-center max-w-[335px] md:max-w-[382px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your email"
                    className="flex-1 px-2 text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#050505] placeholder:opacity-50 outline-none bg-transparent min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-primary-500 text-white font-semibold md:font-bold text-[14px] md:text-[16px] px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {status === "loading" ? "..." : "Notify Me"}
                  </button>
                </div>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
              )}
            </form>
          </div>

          {/* Bottom spacer — takes 3 parts vs 2 above, so content sits ~40% down */}
          <div className="flex-[3]" />

          {/* Service Cards — pinned to bottom of hero */}
          <div className="max-w-[1300px] w-full shrink-0">
            <p className="text-white text-[14px] md:text-[18px] leading-[20px] md:leading-[26px] font-semibold md:font-normal mb-2 max-w-[335px] md:max-w-none">
              Solutions designed around you because confidence starts from
              within.
            </p>

            <div className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
              {SERVICE_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="flex-shrink-0 w-[160px] sm:w-[180px] md:flex-1 md:min-w-0 h-[108px] rounded-xl border border-[#959595]/70 backdrop-blur-[15px] bg-white/[0.01] shadow-[0_4px_40px_rgba(0,0,0,0.07)] p-[6px] flex flex-col gap-2 justify-center cursor-pointer hover:border-white/50 transition-colors"
                >
                  <div className="relative h-[71px] w-full rounded-md overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white font-bold text-[12px] leading-[18px] px-[6px] truncate">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
