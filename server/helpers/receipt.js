import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { getStoreInfo } from "./storeInfo.js";

const money = (n) => `$${Number(n || 0).toFixed(2)}`;
const PAGE_LEFT = 50;
const PAGE_RIGHT = 545;
const COL = {
  item: { x: 50, w: 260 },
  qty: { x: 315, w: 40 },
  price: { x: 365, w: 80 },
  total: { x: 455, w: 90 },
};

// Logo: pehle STORE_LOGO_URL (PNG/JPG link), warna server/assets/logo.png
// (ya STORE_LOGO_PATH). Na mile to sirf store ka naam likha jata hai.
async function loadLogo(store) {
  try {
    if (store.logoUrl) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(store.logoUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) return Buffer.from(await res.arrayBuffer());
    }
    const filePath = path.resolve(process.cwd(), store.logoPath);
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath);
  } catch (err) {
    console.log("Receipt logo load failed:", err.message);
  }
  return null;
}

// Receipt ka PDF banakar Buffer return karta hai.
// customer = { username, email } (optional)
export async function generateReceiptBuffer(order, customer = {}) {
  const store = getStoreInfo();
  const logo = await loadLogo(store);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const shortId = order._id.toString().slice(-8).toUpperCase();
    const date = new Date(order.orderDate || order.createdAt).toLocaleDateString("en-GB");
    const isCod = order.paymentMethod === "cod";

    // ── Header: logo + store name (left), store details (right) ──
    let textX = PAGE_LEFT;
    if (logo) {
      try {
        doc.image(logo, PAGE_LEFT, 45, { fit: [60, 60] });
        textX = PAGE_LEFT + 72;
      } catch (err) {
        console.log("Receipt logo format not supported (use PNG/JPG):", err.message);
      }
    }
    doc.fillColor("#111").font("Helvetica-Bold").fontSize(20).text(store.name, textX, 50, { width: 260 });
    doc.font("Helvetica").fontSize(10).fillColor("#666").text("Order Receipt", textX, doc.y + 2);

    const storeLines = [
      store.address,
      store.phone && `Phone: ${store.phone}`,
      store.email,
      store.website,
      store.taxId && `${store.taxLabel}: ${store.taxId}`,
    ].filter(Boolean);
    doc.fontSize(9).fillColor("#444");
    let ry = 50;
    for (const line of storeLines) {
      doc.text(line, 330, ry, { width: 215, align: "right" });
      ry = doc.y + 1;
    }

    let y = Math.max(doc.y, ry, 110) + 14;
    doc.moveTo(PAGE_LEFT, y).lineTo(PAGE_RIGHT, y).strokeColor("#ddd").stroke();
    y += 14;

    // ── Order info (left) + Billed to (right) ──
    doc.fillColor("#111").font("Helvetica-Bold").fontSize(10).text("RECEIPT DETAILS", PAGE_LEFT, y);
    doc.font("Helvetica").fontSize(10).fillColor("#333");
    const info = [
      `Receipt #: ${shortId}`,
      `Date: ${date}`,
      `Payment method: ${isCod ? "Cash on Delivery" : "Card (Stripe)"}`,
      `Payment status: ${order.paymentStatus}`,
      `Order status: ${order.orderStatus}`,
    ];
    let ly = y + 16;
    for (const line of info) {
      doc.text(line, PAGE_LEFT, ly, { width: 240 });
      ly = doc.y + 2;
    }

    const a = order.addressInfo || {};
    doc.fillColor("#111").font("Helvetica-Bold").fontSize(10).text("BILLED / SHIP TO", 310, y);
    doc.font("Helvetica").fillColor("#333");
    const to = [
      customer.username,
      customer.email,
      a.address,
      [a.city, a.pincode].filter(Boolean).join(" "),
      a.phone && `Phone: ${a.phone}`,
    ].filter(Boolean);
    let cy = y + 16;
    for (const line of to) {
      doc.text(line, 310, cy, { width: 235 });
      cy = doc.y + 2;
    }

    y = Math.max(ly, cy) + 16;

    // ── Items table ──
    const drawHeader = (yy) => {
      doc.rect(PAGE_LEFT, yy - 4, PAGE_RIGHT - PAGE_LEFT, 20).fill("#f3f4f6");
      doc.fillColor("#111").font("Helvetica-Bold").fontSize(10);
      doc.text("Item", COL.item.x + 6, yy + 1, { width: COL.item.w });
      doc.text("Qty", COL.qty.x, yy + 1, { width: COL.qty.w, align: "right" });
      doc.text("Price", COL.price.x, yy + 1, { width: COL.price.w, align: "right" });
      doc.text("Total", COL.total.x, yy + 1, { width: COL.total.w - 6, align: "right" });
      doc.font("Helvetica").fillColor("#222");
      return yy + 24;
    };
    y = drawHeader(y);

    let subtotal = 0;
    for (const item of order.cartItems || []) {
      const lineTotal = (item.price || 0) * (item.quantity || 0);
      subtotal += lineTotal;
      const rowH = Math.max(
        18,
        doc.heightOfString(item.title || "Item", { width: COL.item.w - 6 }) + 6
      );
      if (y + rowH > 720) {
        doc.addPage();
        y = drawHeader(50);
      }
      doc.fontSize(10).fillColor("#222");
      doc.text(item.title || "Item", COL.item.x + 6, y, { width: COL.item.w - 6 });
      doc.text(String(item.quantity), COL.qty.x, y, { width: COL.qty.w, align: "right" });
      doc.text(money(item.price), COL.price.x, y, { width: COL.price.w, align: "right" });
      doc.text(money(lineTotal), COL.total.x, y, { width: COL.total.w - 6, align: "right" });
      y += rowH;
      doc.moveTo(PAGE_LEFT, y - 2).lineTo(PAGE_RIGHT, y - 2).strokeColor("#eee").stroke();
    }

    // ── Totals ──
    if (y > 650) {
      doc.addPage();
      y = 50;
    }
    y += 8;
    const row = (label, value, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 12 : 10).fillColor("#111");
      doc.text(label, COL.price.x - 60, y, { width: 140, align: "right" });
      doc.text(value, COL.total.x, y, { width: COL.total.w - 6, align: "right" });
      y += bold ? 20 : 16;
    };
    row("Subtotal", money(subtotal));
    const shipping = (order.totalAmount || 0) - subtotal;
    if (shipping > 0.009) row("Shipping", money(shipping));
    doc.moveTo(COL.price.x - 20, y).lineTo(PAGE_RIGHT, y).strokeColor("#999").stroke();
    y += 6;
    row(isCod ? "Total (due on delivery)" : "Total Paid", money(order.totalAmount), true);

    // ── Footer ──
    doc.font("Helvetica").fontSize(10).fillColor("#666");
    doc.text(store.footerNote, PAGE_LEFT, Math.max(y + 30, 760), {
      width: PAGE_RIGHT - PAGE_LEFT,
      align: "center",
    });

    doc.end();
  });
}
