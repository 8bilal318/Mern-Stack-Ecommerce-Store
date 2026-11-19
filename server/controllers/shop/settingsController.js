// import Settings from "../../models/Settings.js";

// // Storefront (public) ke liye sirf popup config bhejna hai, admin ke andaruni
// // feature toggles yahan expose nahi karne (security ke liye)
// export const getPublicSettings = async (req, res) => {
//   try {
//     let settings = await Settings.findOne({ key: "site_settings" });

//     if (!settings) {
//       settings = await Settings.create({ key: "site_settings" });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         popup: settings.popup,
//         storefront: settings.features?.storefront ?? true,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Error fetching settings" });
//   }
// };


























// import Settings from "../../models/Settings.js";

// // Storefront (public) ke liye sirf popup config bhejna hai, admin ke andaruni
// // feature toggles yahan expose nahi karne (security ke liye)
// export const getPublicSettings = async (req, res) => {
//   try {
//     let settings = await Settings.findOne({ key: "site_settings" });

//     if (!settings) {
//       settings = await Settings.create({ key: "site_settings" });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         popup: settings.popup,
//         storefront: settings.features?.storefront ?? true,
//         payments: settings.features?.payments ?? true,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Error fetching settings" });
//   }
// };




















import Settings from "../../models/Settings.js";

// Storefront (public) ke liye sirf popup config bhejna hai, admin ke andaruni
// feature toggles yahan expose nahi karne (security ke liye)
export const getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "site_settings" });

    if (!settings) {
      settings = await Settings.create({ key: "site_settings" });
    }

    res.status(200).json({
      success: true,
      data: {
        popup: settings.popup,
        storefront: settings.features?.storefront ?? true,
        payments: settings.features?.payments ?? true,
        shipping: settings.features?.shipping ?? true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching settings" });
  }
};