import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Package,
  Bell,
  Truck,
  ShieldCheck,
  CreditCard,
  Zap,
  MessageSquareText,
  UploadCloud,
  Loader2,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchAdminSettings,
  updateFeatures,
  updatePopup,
} from "@/store/admin/settings-slice/Index.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const featureList = [
  { id: "storefront", title: "Storefront UI", description: "Customer-facing interface", icon: ShoppingBag },
  { id: "inventory", title: "Inventory Sync", description: "Real-time stock updates", icon: Package },
  { id: "payments", title: "Payment Gateways", description: "Stripe/PayPal active", icon: CreditCard },
  { id: "shipping", title: "Automated Shipping", description: "Courier integration", icon: Truck },
  { id: "notifications", title: "Push Notifications", description: "Order alerts", icon: Bell },
  { id: "security", title: "Firewall Protection", description: "WAF & 2FA enabled", icon: ShieldCheck },
];

const defaultPopupForm = {
  enabled: false,
  title: "",
  message: "",
  image: "",
  buttonText: "",
  buttonLink: "",
  delaySeconds: 1,
  showOncePerSession: true,
};

const Features = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.adminSettings);

  const [activeFeatures, setActiveFeatures] = useState(null);
  const [popupForm, setPopupForm] = useState(defaultPopupForm);
  const [imageUploading, setImageUploading] = useState(false);
  const [savingPopup, setSavingPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminSettings());
  }, [dispatch]);

  // Sync local state as soon as the settings arrive from the backend
  useEffect(() => {
    if (settings?.features) setActiveFeatures(settings.features);
    if (settings?.popup) setPopupForm({ ...defaultPopupForm, ...settings.popup });
  }, [settings]);

  const handleToggle = (id) => {
    const updated = { ...activeFeatures, [id]: !activeFeatures[id] };
    setActiveFeatures(updated);

    dispatch(updateFeatures(updated)).then((data) => {
      if (data?.payload?.success) {
        toast.success(`Feature ${id} updated successfully!`);
      } else {
        toast.error("Failed to update feature");
        setActiveFeatures(activeFeatures); // revert on failure
      }
    });
  };

  async function handlePopupImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const data = new FormData();
      data.append("my_file", file);
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/products/upload-image`,
        data,
      );

      if (response?.data?.success) {
        setPopupForm((prev) => ({
          ...prev,
          image: response.data.result.secure_url || response.data.result.url,
        }));
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  }

  function handleSavePopup() {
    setSavingPopup(true);
    dispatch(updatePopup(popupForm)).then((data) => {
      setSavingPopup(false);
      if (data?.payload?.success) {
        toast.success("Popup settings saved! Visit the home page to preview it.");
      } else {
        toast.error("Failed to save popup settings");
      }
    });
  }

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white font-sans relative overflow-hidden">
      {/* Brand Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-orange-600/5 blur-[120px] -z-10" />

      <div className="mb-12 border-b border-zinc-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Core Engine</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            System <span className="text-orange-600">Modules</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium text-sm uppercase tracking-widest">
            Manage high-performance configurations for BillaMart.
          </p>
        </div>

        <div className="px-5 py-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Environment: Production</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((feature) => {
          const isActive = activeFeatures ? activeFeatures[feature.id] : false;
          return (
            <Card
              key={feature.id}
              className={`bg-zinc-900/30 border-zinc-800/80 rounded-[32px] overflow-hidden transition-all duration-500 group relative ${
                isActive ? 'border-orange-600/30' : 'opacity-70 grayscale-[0.5]'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-transparent pointer-events-none" />
              )}

              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${
                    isActive
                    ? "bg-orange-600 text-white shadow-[0_10px_30px_rgba(234,88,12,0.3)] rotate-3"
                    : "bg-zinc-800 text-zinc-500 -rotate-3"
                  }`}>
                    <feature.icon className="h-7 w-7" />
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Switch
                      checked={isActive}
                      disabled={!activeFeatures}
                      onCheckedChange={() => handleToggle(feature.id)}
                      className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-zinc-800 border-none scale-125"
                    />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-orange-500' : 'text-zinc-600'}`}>
                      {isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-black uppercase italic tracking-tighter transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-500'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mt-1">
                    {feature.description}
                  </p>
                </div>

                <div className={`absolute bottom-0 left-0 h-1 transition-all duration-700 ${
                  isActive ? 'w-full bg-orange-600 shadow-[0_-5px_15px_rgba(234,88,12,0.4)]' : 'w-0 bg-zinc-800'
                }`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Homepage Popup Manager */}
      <div className="mt-16 border-t border-zinc-900 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-orange-600/10 text-orange-500">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Home Page <span className="text-orange-600">Popup</span>
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
              This popup is shown to the customer as soon as the home page opens
            </p>
          </div>
        </div>

        <Card className="bg-zinc-900/30 border-zinc-800/80 rounded-[32px]">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-zinc-950/50 border border-zinc-800 px-5 py-4">
              <div>
                <p className="text-sm font-black uppercase italic tracking-tight text-white">Enable Popup</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  Turn on/off; it takes effect on the home page immediately
                </p>
              </div>
              <Switch
                checked={popupForm.enabled}
                onCheckedChange={(checked) => setPopupForm((prev) => ({ ...prev, enabled: checked }))}
                className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-zinc-800 border-none scale-125"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">Title</Label>
                <Input
                  value={popupForm.title}
                  onChange={(e) => setPopupForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Welcome to BillaMart!"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div>
                <Label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">Button Text</Label>
                <Input
                  value={popupForm.buttonText}
                  onChange={(e) => setPopupForm((prev) => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="e.g. Shop Now"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">Message</Label>
              <Textarea
                value={popupForm.message}
                onChange={(e) => setPopupForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Text to show in the popup"
                className="bg-zinc-950 border-zinc-800 text-white min-h-[90px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">Button Link</Label>
                <Input
                  value={popupForm.buttonLink}
                  onChange={(e) => setPopupForm((prev) => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="/shop/listing"
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div>
                <Label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">Delay (seconds)</Label>
                <Input
                  type="number"
                  min={0}
                  value={popupForm.delaySeconds}
                  onChange={(e) => setPopupForm((prev) => ({ ...prev, delaySeconds: Number(e.target.value) }))}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-zinc-950/50 border border-zinc-800 px-5 py-4">
              <div>
                <p className="text-sm font-black uppercase italic tracking-tight text-white">Show Once Per Session</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  When on, each visitor sees it only once (per browser session)
                </p>
              </div>
              <Switch
                checked={popupForm.showOncePerSession}
                onCheckedChange={(checked) => setPopupForm((prev) => ({ ...prev, showOncePerSession: checked }))}
                className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-zinc-800 border-none scale-125"
              />
            </div>

            <div>
              <Label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">Popup Image (optional)</Label>
              {popupForm.image ? (
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center gap-4">
                    <img src={popupForm.image} alt="Popup preview" className="h-16 w-16 rounded-xl object-cover" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Image ready</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-zinc-900 text-zinc-500 hover:bg-red-600 hover:text-white"
                    onClick={() => setPopupForm((prev) => ({ ...prev, image: "" }))}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Label
                  htmlFor="popup-image-upload"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950 px-6 text-center hover:border-orange-600/50 transition-all"
                >
                  {imageUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  ) : (
                    <>
                      <UploadCloud className="h-6 w-6 text-orange-500 mb-2" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Click to upload image</span>
                    </>
                  )}
                  <Input id="popup-image-upload" type="file" className="hidden" onChange={handlePopupImageChange} />
                </Label>
              )}
            </div>

            <Button
              onClick={handleSavePopup}
              disabled={savingPopup}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl py-6"
            >
              {savingPopup ? "Saving..." : "Save Popup Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Features;