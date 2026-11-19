import Settings from "../../models/Settings.js";

// Agar settings document exist nahi karta to default bana kar return karo
async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: "site_settings" });

  if (!settings) {
    settings = await Settings.create({ key: "site_settings" });
  }

  return settings;
}

// Admin panel ke liye poori settings (features + popup) laane ke liye
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching settings" });
  }
};

// Feature toggles update karne ke liye (Storefront, Inventory, Payments, etc.)
export const updateFeatures = async (req, res) => {
  try {
    const { features } = req.body;

    if (!features || typeof features !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Features object is required" });
    }

    const settings = await getOrCreateSettings();

    settings.features = { ...settings.features.toObject(), ...features };
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Features updated successfully",
      data: settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating features" });
  }
};

// Homepage popup config update karne ke liye
export const updatePopup = async (req, res) => {
  try {
    const { popup } = req.body;

    if (!popup || typeof popup !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Popup object is required" });
    }

    const settings = await getOrCreateSettings();

    settings.popup = { ...settings.popup.toObject(), ...popup };
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Popup settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating popup settings" });
  }
};
