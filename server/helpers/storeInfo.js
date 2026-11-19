// Store ki details (receipt aur email dono mein use hoti hain).
// Sab kuch server/.env se aata hai, taake code badalna na pare.
export const getStoreInfo = () => ({
  name: process.env.STORE_NAME || "BillaMart",
  address: process.env.STORE_ADDRESS || "",
  phone: process.env.STORE_PHONE || "",
  email: process.env.STORE_EMAIL || "",
  website: process.env.STORE_WEBSITE || "",
  taxLabel: process.env.STORE_TAX_LABEL || "Tax ID",
  taxId: process.env.STORE_TAX_ID || "",
  footerNote:
    process.env.STORE_RECEIPT_NOTE || "Thank you for shopping with us!",
  logoUrl: process.env.STORE_LOGO_URL || "",
  logoPath: process.env.STORE_LOGO_PATH || "assets/logo.png",
});
