import {
  Target,
  Eye,
  Users,
  Truck,
  ShieldCheck,
  Sparkles,
  Award,
  Heart,
} from "lucide-react";

// ---------------- Data ----------------
const values = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Trust & Quality",
    desc: "Every product on BillaMart is sourced from verified brands and checked for quality before it reaches your door.",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Fast & Reliable Delivery",
    desc: "We partner with trusted courier networks so your order reaches you quickly, safely, and on time — every time.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Customer First",
    desc: "From easy returns to 24/7 support, everything we build starts with one question: what's best for the customer?",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Handpicked Collections",
    desc: "Our team curates every category — from footwear to accessories — so you always shop from the best of the best.",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Delivered" },
  { value: "200+", label: "Trusted Brands" },
  { value: "24/7", label: "Customer Support" },
];

// ---------------- Page ----------------
function About() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black px-4 py-20 text-center md:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-600/20 blur-3xl" />
        <span className="relative inline-flex items-center gap-2 rounded-full border border-orange-600/30 bg-orange-600/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-500">
          <Heart className="h-3.5 w-3.5" />
          Our Story
        </span>
        <h1 className="relative mt-6 text-4xl font-black uppercase tracking-tighter md:text-6xl">
          About <span className="text-orange-600">BillaMart</span>
        </h1>
        <p className="relative mx-auto mt-4 max-w-2xl text-sm font-medium text-zinc-400 md:text-base">
          BillaMart is your one-stop online marketplace for fashion, footwear,
          and accessories. We exist to make quality shopping simple,
          affordable, and enjoyable for everyone, everywhere.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:border-orange-600/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/10 text-orange-500">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-xl font-black uppercase tracking-tight">
            Our Mission
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            To connect people with the products they love through a seamless,
            trustworthy, and enjoyable online shopping experience — backed by
            fair pricing and genuine customer care.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:border-orange-600/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/10 text-orange-500">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-xl font-black uppercase tracking-tight">
            Our Vision
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            To become a leading e-commerce destination known for reliability
            and innovation, empowering shoppers with more choice, more value,
            and a smoother way to shop online.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800 bg-zinc-950 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-orange-600 md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter md:text-4xl">
            What We <span className="text-orange-600">Stand For</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-500">
            The values that guide every decision we make at BillaMart.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-orange-600/40 hover:bg-zinc-900"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/10 text-orange-500">
                {value.icon}
              </div>
              <div>
                <h3 className="mb-1 font-bold">{value.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {value.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team / CTA */}
      <section className="border-t border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-black px-4 py-16 text-center md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-500">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
            Built by a Team That Loves Retail
          </h2>
          <p className="text-sm text-zinc-400">
            Behind BillaMart is a small, dedicated team of developers,
            designers, and retail enthusiasts working to bring you a better
            way to shop online. Thank you for being part of our journey.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
