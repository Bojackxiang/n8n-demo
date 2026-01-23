"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Package,
  TrendingUp,
  Shield,
  ArrowRight,
  Check,
  Workflow,
  BarChart3,
  Clock,
  Users,
  Target,
  Heart,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Gradient Orbs with Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl animate-pulse" />
        <div
          className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-1/3 bottom-20 h-96 w-96 rounded-full bg-cyan-600/30 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
      {/* Floating Navbar */}
      <nav className="fixed left-4 right-4 top-4 z-50">
        <div className="mx-auto max-w-7xl rounded-2xl border border-blue-500/30 bg-black/80 px-6 py-4 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                ShopNode
              </span>
            </div>
            {/* Nav Links */}
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#features"
                className="font-medium text-slate-300 transition-all duration-200 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="font-medium text-slate-300 transition-all duration-200 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="font-medium text-slate-300 transition-all duration-200 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              >
                About
              </a>
            </div>
            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  className="hidden cursor-pointer text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 md:inline-flex"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 font-medium text-white shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/70 hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 shadow-lg shadow-blue-500/20 backdrop-blur-sm">
              <Zap className="h-4 w-4 animate-pulse" />
              Automate Your E-commerce Workflow
            </div>

            {/* Headline */}
            <h1 className="mb-6 font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              Manage Your Shop
              <br />
              Like a{" "}
              <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.9)]">
                Pro
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">
              ShopNode combines the power of visual automation with e-commerce
              management. Upload products, adjust inventory, and sync across
              platforms—all in one workflow.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 px-8 font-medium text-white shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/70 hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)] sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full cursor-pointer border-blue-500/50 bg-blue-500/5 text-blue-400 backdrop-blur-sm transition-all duration-200 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-300 sm:w-auto"
              >
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 shadow-2xl shadow-blue-500/30 backdrop-blur-xl">
              {/* Mock Dashboard Screenshot */}
              <div className="aspect-video bg-linear-to-br from-slate-900 to-black relative">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Workflow className="mx-auto mb-4 h-16 w-16 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    <p className="text-slate-500">Dashboard Preview</p>
                  </div>
                </div>
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/50"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/50"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/50"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Everything You Need to Scale
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Powerful automation tools built for modern e-commerce sellers
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Product Management",
                description:
                  "Upload and manage products across multiple platforms with a single workflow",
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: "Inventory Sync",
                description:
                  "Real-time inventory synchronization across all your sales channels",
                color: "green",
              },
              {
                icon: Workflow,
                title: "Visual Automation",
                description:
                  "Build complex workflows with drag-and-drop simplicity, no code required",
                color: "purple",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description:
                  "Track sales, inventory, and performance metrics in one place",
                color: "orange",
              },
              {
                icon: Clock,
                title: "Scheduled Tasks",
                description:
                  "Automate price updates, promotions, and inventory checks on schedule",
                color: "pink",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Enterprise-grade security with 99.9% uptime guarantee",
                color: "indigo",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100"></div>

                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Choose the plan that fits your business needs. Upgrade or
              downgrade anytime.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6">
                  <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                    Free
                  </h3>
                  <p className="text-slate-400">Perfect for getting started</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="font-heading text-5xl font-bold text-white">
                      $0
                    </span>
                    <span className="ml-2 text-slate-400">/month</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button
                    variant="outline"
                    className="mb-6 w-full cursor-pointer border-blue-500/50 bg-blue-500/5 text-blue-400 transition-all duration-200 hover:bg-blue-500/10 hover:border-blue-400"
                  >
                    Get Started
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {[
                    "Up to 10 products",
                    "1 workflow automation",
                    "Basic inventory sync",
                    "7-day data retention",
                    "Community support",
                    "Single sales channel",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                      <span className="text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-500 bg-black/70 p-8 shadow-2xl shadow-blue-500/40 backdrop-blur-xl">
              {/* Popular Badge */}
              <div className="absolute right-4 top-4 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/50">
                Most Popular
              </div>
              {/* Animated glow border */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 opacity-50"></div>
              <div className="relative">
                <div className="mb-6">
                  <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                    Pro
                  </h3>
                  <p className="text-slate-400">For growing businesses</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="font-heading text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      $9.99
                    </span>
                    <span className="ml-2 text-slate-400">/month</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button className="mb-6 w-full cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 font-medium text-white shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/70 hover:drop-shadow-[0_0_15px_rgba(59,130,246,1)]">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {[
                    "Up to 100 products",
                    "5 workflow automations",
                    "Real-time inventory sync",
                    "30-day data retention",
                    "Priority email support",
                    "Up to 3 sales channels",
                    "Advanced analytics dashboard",
                    "Scheduled price updates",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                      <span className="text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Business Plan */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6">
                  <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                    Business
                  </h3>
                  <p className="text-slate-400">For large-scale operations</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="font-heading text-5xl font-bold text-white">
                      $19.99
                    </span>
                    <span className="ml-2 text-slate-400">/month</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button
                    variant="outline"
                    className="mb-6 w-full cursor-pointer border-blue-500/50 bg-blue-500/5 text-blue-400 transition-all duration-200 hover:bg-blue-500/10 hover:border-blue-400"
                  >
                    Get Started
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {[
                    "Unlimited products",
                    "Unlimited workflow automations",
                    "Multi-platform inventory sync",
                    "Unlimited data retention",
                    "24/7 priority support",
                    "Unlimited sales channels",
                    "Custom analytics & reports",
                    "Bulk operations & imports",
                    "API access",
                    "Dedicated account manager",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                      <span className="text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 text-center">
            <p className="text-slate-400">
              <Shield className="mr-2 inline-block h-5 w-5 text-green-400" />
              14-day money-back guarantee • No credit card required for free
              trial
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Built for Modern E-commerce
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              We believe running an online shop should be simple, not
              overwhelming. That's why we built ShopNode.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="group mb-16 overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30 md:p-12">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 group-hover:opacity-100"></div>
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="mb-4 font-heading text-2xl font-bold text-white">
                Our Mission
              </h3>
              <p className="text-lg leading-relaxed text-slate-400">
                To empower e-commerce sellers with intelligent automation that
                saves time, reduces errors, and scales with their business.
                Every seller deserves tools that work as hard as they do—without
                the complexity or cost of enterprise software.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-16 grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Users,
                value: "10K+",
                label: "Active Sellers",
              },
              {
                icon: Package,
                value: "1M+",
                label: "Products Managed",
              },
              {
                icon: Workflow,
                value: "50K+",
                label: "Workflows Created",
              },
              {
                icon: TrendingUp,
                value: "99.9%",
                label: "Uptime",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-6 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mb-2 font-heading text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <div>
            <h3 className="mb-8 text-center font-heading text-2xl font-bold text-white">
              What Drives Us
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  title: "Innovation First",
                  description:
                    "We constantly evolve our platform with cutting-edge automation technology to stay ahead of e-commerce trends.",
                },
                {
                  icon: Heart,
                  title: "Seller-Centric",
                  description:
                    "Every feature is designed with real seller feedback. Your success is our success.",
                },
                {
                  icon: Shield,
                  title: "Trust & Security",
                  description:
                    "Your data is encrypted and protected with enterprise-grade security. We never compromise on safety.",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50">
                      <value.icon className="h-6 w-6" />
                    </div>
                    <h4 className="mb-2 font-heading text-xl font-semibold text-white">
                      {value.title}
                    </h4>
                    <p className="text-slate-400">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-12 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30">
            {/* Hover glow overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100"></div>

            <div className="relative text-center">
              {/* Icon */}
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50">
                <Zap className="h-8 w-8" />
              </div>

              <h2 className="mb-4 font-heading text-3xl font-bold text-white sm:text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                Ready to Automate Your Shop?
              </h2>
              <p className="mb-8 text-lg text-slate-400">
                Join thousands of sellers who trust ShopNode to manage their
                e-commerce operations
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 px-8 font-medium text-white shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/70 hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)]"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-white">
                ShopNode
              </span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 ShopNode. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
