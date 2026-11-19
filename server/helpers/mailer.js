import nodemailer from "nodemailer";
import dns from "node:dns";
import net from "node:net";
import { getStoreInfo } from "./storeInfo.js";

// Two ways to send email:
//  1) Brevo HTTPS API  (BREVO_API_KEY)  -> works even when your ISP blocks SMTP ports
//  2) SMTP / Gmail     (SMTP_HOST, SMTP_USER, SMTP_PASS)
const useBrevo = () => Boolean(process.env.BREVO_API_KEY);

export const isMailConfigured = () =>
  useBrevo() ||
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

// "BillaMart <me@gmail.com>"  ->  { name: "BillaMart", email: "me@gmail.com" }
function parseFrom(store) {
  const raw = process.env.MAIL_FROM || process.env.SMTP_USER || "";
  const match = raw.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (match) return { name: match[1].trim() || store.name, email: match[2].trim() };
  return { name: store.name, email: raw.trim() };
}

async function sendViaBrevo({ to, subject, html, attachments }, store) {
  const sender = parseFrom(store);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to }],
        subject,
        htmlContent: html,
        attachment: (attachments || []).map((a) => ({
          name: a.filename,
          content: Buffer.from(a.content).toString("base64"),
        })),
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Brevo API ${res.status}: ${text.slice(0, 300)}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

function canConnect(ip, port, ms = 4000) {
  return new Promise((resolve) => {
    const s = net.connect({ host: ip, port });
    s.setTimeout(ms);
    s.once("connect", () => {
      s.destroy();
      resolve(true);
    });
    s.once("timeout", () => {
      s.destroy();
      resolve(false);
    });
    s.once("error", () => resolve(false));
  });
}

// On some networks one of Gmail's 2 IPs is blocked (and Node picks that IP).
// So we test all IPv4 addresses together and use whichever one works.
async function pickReachableHost(host, port) {
  if (net.isIP(host)) return host;
  try {
    const ips = await dns.promises.resolve4(host);
    return await Promise.any(
      ips.map((ip) =>
        canConnect(ip, port).then((ok) => {
          if (!ok) throw new Error("unreachable");
          return ip;
        })
      )
    );
  } catch {
    return null; // no reachable IP found on this port
  }
}

let transporterPromise = null;

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const configuredPort = Number(process.env.SMTP_PORT) || 587;
      const host = process.env.SMTP_HOST;

      // Some networks/ISPs block port 465 (or 587). If the configured port is not
      // reachable, automatically try the other one before giving up.
      let port = configuredPort;
      let target = await pickReachableHost(host, configuredPort);
      if (!target) {
        const altPort = configuredPort === 465 ? 587 : 465;
        const altTarget = await pickReachableHost(host, altPort);
        if (altTarget) {
          port = altPort;
          target = altTarget;
        }
      }
      if (!target) target = host; // fall back to the normal hostname

      return nodemailer.createTransport({
        host: target,
        port,
        secure: port === 465, // 465 = SSL, 587 = STARTTLS
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { servername: host }, // even when an IP is used, the certificate is checked against the Gmail hostname
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
      });
    })();
  }
  return transporterPromise;
}

// SMTP connection + login check (for the test script)
export async function verifyMail() {
  if (useBrevo()) {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { accept: "application/json", "api-key": process.env.BREVO_API_KEY },
    });
    if (!res.ok) throw new Error(`Brevo API ${res.status}: check BREVO_API_KEY`);
    return true;
  }
  try {
    return await (await getTransporter()).verify();
  } catch (err) {
    transporterPromise = null;
    throw err;
  }
}

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `$${Number(n || 0).toFixed(2)}`;
const shortId = (order) => order._id.toString().slice(-8).toUpperCase();

// ── Common email layout (orange header, white card) ──
function layout({ store, badge, title, intro, bodyHtml }) {
  return `
  <div style="background:#f4f4f5;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#222">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:#ea580c;color:#ffffff;padding:20px 24px">
        <div style="font-size:20px;font-weight:bold">${esc(store.name)}</div>
      </div>
      <div style="padding:24px">
        <div style="display:inline-block;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:bold;letter-spacing:.5px">${esc(badge)}</div>
        <h2 style="margin:14px 0 6px;font-size:22px">${esc(title)}</h2>
        <p style="margin:0 0 18px;color:#555;line-height:1.5">${intro}</p>
        ${bodyHtml}
      </div>
      <div style="background:#fafafa;border-top:1px solid #eee;padding:16px 24px;font-size:12px;color:#777;line-height:1.6">
        ${esc(store.name)}${store.address ? " &middot; " + esc(store.address) : ""}<br/>
        ${store.phone ? "Phone: " + esc(store.phone) : ""}${store.phone && store.email ? " &middot; " : ""}${store.email ? esc(store.email) : ""}
      </div>
    </div>
  </div>`;
}

function itemsTable(order) {
  const rows = (order.cartItems || [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f1f1f1">${esc(i.title)} <span style="color:#888">&times; ${i.quantity}</span></td>
          <td style="padding:8px 0;border-bottom:1px solid #f1f1f1;text-align:right">${money(i.price * i.quantity)}</td>
        </tr>`
    )
    .join("");
  const isCod = order.paymentMethod === "cod";
  const subtotal = (order.cartItems || []).reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = (order.totalAmount || 0) - subtotal;
  const shippingRow =
    shipping > 0.009
      ? `<tr>
          <td style="padding:8px 0;color:#777">Shipping</td>
          <td style="padding:8px 0;text-align:right;color:#777">${money(shipping)}</td>
        </tr>`
      : "";
  return `
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0 4px">
    ${rows}
    ${shippingRow}
    <tr>
      <td style="padding:12px 0;font-weight:bold">${isCod ? "Total (pay on delivery)" : "Total paid"}</td>
      <td style="padding:12px 0;text-align:right;font-weight:bold;color:#ea580c;font-size:16px">${money(order.totalAmount)}</td>
    </tr>
  </table>`;
}

function addressBlock(order) {
  const a = order.addressInfo || {};
  return `
  <div style="margin-top:14px;font-size:14px;line-height:1.6">
    <div style="font-weight:bold;margin-bottom:2px">Shipping to</div>
    ${esc(a.address || "")}<br/>${esc([a.city, a.pincode].filter(Boolean).join(" "))}<br/>${a.phone ? "Phone: " + esc(a.phone) : ""}
  </div>`;
}

async function send({ to, subject, html, attachments }) {
  const store = getStoreInfo();
  if (useBrevo()) {
    return sendViaBrevo({ to, subject, html, attachments }, store);
  }
  try {
    const t = await getTransporter();
    await t.sendMail({
      from: process.env.MAIL_FROM || `"${store.name}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
  } catch (err) {
    transporterPromise = null; // next time, look for the best IP again
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 1) Order confirmed email (with the receipt PDF attached)
// ─────────────────────────────────────────────────────────────
export async function sendOrderConfirmationEmail({ to, customerName, order, pdfBuffer }) {
  const store = getStoreInfo();
  const id = shortId(order);
  const isCod = order.paymentMethod === "cod";
  const date = new Date(order.orderDate || order.createdAt).toLocaleDateString("en-GB");

  const bodyHtml = `
    <table style="width:100%;font-size:14px;margin-bottom:10px">
      <tr><td style="color:#777;padding:2px 0">Order number</td><td style="text-align:right;font-weight:bold">#${id}</td></tr>
      <tr><td style="color:#777;padding:2px 0">Order date</td><td style="text-align:right">${date}</td></tr>
      <tr><td style="color:#777;padding:2px 0">Payment</td><td style="text-align:right">${isCod ? "Cash on Delivery" : "Card (paid)"}</td></tr>
    </table>
    ${itemsTable(order)}
    ${addressBlock(order)}
    <p style="margin:20px 0 0;font-size:13px;color:#666;line-height:1.5">
      Your receipt is attached to this email as a PDF. We will email you again when your order is shipped.
    </p>`;

  const html = layout({
    store,
    badge: "ORDER CONFIRMED",
    title: "Your order is confirmed!",
    intro: `Hi ${esc(customerName || "Customer")}, thank you for shopping with ${esc(store.name)}. We have received your order and are getting it ready.`,
    bodyHtml,
  });

  await send({
    to,
    subject: `Order confirmed - #${id} | ${store.name}`,
    html,
    attachments: pdfBuffer
      ? [{ filename: `receipt-${id}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
      : [],
  });
}

// Old name (kept for compatibility)
export const sendReceiptEmail = sendOrderConfirmationEmail;

// ─────────────────────────────────────────────────────────────
// 2) Status update emails: shipped / delivered / cancelled
// ─────────────────────────────────────────────────────────────
const STATUS_COPY = {
  shipped: {
    badge: "ORDER SHIPPED",
    title: "Your order is on its way!",
    intro: "Good news! Your order has been shipped and is on its way to you.",
    subject: "Your order has been shipped",
  },
  delivered: {
    badge: "ORDER DELIVERED",
    title: "Your order has been delivered",
    intro: "Your order has been delivered. We hope you love it! Thank you for shopping with us.",
    subject: "Your order has been delivered",
  },
  cancelled: {
    badge: "ORDER CANCELLED",
    title: "Your order has been cancelled",
    intro: "Your order has been cancelled. If you did not request this, or if a payment was made, please contact us and we will help you.",
    subject: "Your order has been cancelled",
  },
};

export const STATUS_EMAIL_KEYS = Object.keys(STATUS_COPY);

export async function sendOrderStatusEmail({ to, customerName, order, status }) {
  const copy = STATUS_COPY[status];
  if (!copy) return;
  const store = getStoreInfo();
  const id = shortId(order);

  const bodyHtml = `
    <table style="width:100%;font-size:14px;margin-bottom:10px">
      <tr><td style="color:#777;padding:2px 0">Order number</td><td style="text-align:right;font-weight:bold">#${id}</td></tr>
    </table>
    ${itemsTable(order)}
    ${status === "cancelled" ? "" : addressBlock(order)}
    ${store.email ? `<p style="margin:20px 0 0;font-size:13px;color:#666">Questions? Reply to this email or write to ${esc(store.email)}.</p>` : ""}`;

  const html = layout({
    store,
    badge: copy.badge,
    title: copy.title,
    intro: `Hi ${esc(customerName || "Customer")}, ${copy.intro}`,
    bodyHtml,
  });

  await send({
    to,
    subject: `${copy.subject} - #${id} | ${store.name}`,
    html,
  });
}