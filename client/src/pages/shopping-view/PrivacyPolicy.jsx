import { ShieldCheck } from "lucide-react";

// ---------------- Data ----------------
const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment details when you create an account, place an order, or contact our support team.",
      "We also automatically collect certain information when you use BillaMart, including your IP address, browser type, device information, pages visited, and cart activity, through cookies and similar technologies.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "We use the information we collect to process and deliver your orders, manage your account, respond to your inquiries, and provide customer support.",
      "We also use your information to send order updates, personalize your shopping experience, improve our products and services, prevent fraud, and — where you have opted in — send promotional offers and newsletters.",
    ],
  },
  {
    title: "3. Sharing of Information",
    body: [
      "We do not sell your personal information. We may share your information with trusted third parties who help us operate our business, such as payment processors, shipping and courier partners, and IT service providers, solely for the purpose of fulfilling your order and improving our services.",
      "We may also disclose information when required by law, to protect our rights, or in connection with a business transaction such as a merger or acquisition.",
    ],
  },
  {
    title: "4. Cookies & Tracking Technologies",
    body: [
      "BillaMart uses cookies and similar tracking technologies to keep you signed in, remember your cart, understand how you use our site, and improve overall performance.",
      "You can control or disable cookies through your browser settings, though some features of the site may not function properly without them.",
    ],
  },
  {
    title: "5. Payment Security",
    body: [
      "All payment transactions are processed through secure, encrypted, PCI-compliant payment gateways. BillaMart does not store your full card or banking details on our servers.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "We retain your personal information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    title: "7. Your Rights & Choices",
    body: [
      "You have the right to access, update, or delete your personal information at any time from your account settings, or by contacting our support team.",
      "You may also opt out of marketing communications at any time by using the unsubscribe link in our emails or updating your notification preferences.",
    ],
  },
  {
    title: "8. Data Security",
    body: [
      "We implement industry-standard technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "9. Children's Privacy",
    body: [
      "BillaMart is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the updated policy on this page with a revised effective date.",
    ],
  },
  {
    title: "11. Contact Us",
    body: [
      "If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please reach out to us at bilalmalik.bm02950@gmail.com",
    ],
  },
];

// ---------------- Page ----------------
function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black px-4 py-16 text-center md:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-600/20 blur-3xl" />
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-500">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="relative mt-5 text-4xl font-black uppercase tracking-tighter md:text-5xl">
          Privacy <span className="text-orange-600">Policy</span>
        </h1>
        <p className="relative mx-auto mt-3 max-w-2xl text-sm font-medium text-zinc-400">
          Your privacy matters to us. This policy explains what information
          we collect, how we use it, and the choices you have.
        </p>
        <p className="relative mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-600">
          Last Updated: September 2, 2026
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-3xl px-4 py-14 md:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-lg font-black uppercase tracking-tight text-orange-500 md:text-xl">
                {section.title}
              </h2>
              {section.body.map((para, idx) => (
                <p
                  key={idx}
                  className="mb-3 text-sm leading-relaxed text-zinc-400"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
