import React, { useEffect, useState } from "react";
import { Plus, Loader2, PackageSearch, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommonForm from "@/components/comman/Form";
import { addProductFormElements } from "@/config/Index.js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProductImageUpload from "@/components/admin-view/Image-upload";
import AdminProductTile from "@/components/admin-view/ProductTile";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/product-slice/Index";
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  function resetProductForm() {
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl(null);
    setOpenCreateProductsDialog(false);
  }

  function onSubmit(event) {
    event.preventDefault();
    if (imageLoadingState) return toast.error("Please wait for image upload");
    if (!uploadedImageUrl) return toast.error("Image is required");

    setIsLoading(true);
    const action = currentEditedId
      ? editProduct({ id: currentEditedId, formData: { ...formData, image: uploadedImageUrl } })
      : addNewProduct({ ...formData, image: uploadedImageUrl });

    dispatch(action).then((data) => {
      setIsLoading(false);
      if (data?.payload?.success) {
        resetProductForm();
        dispatch(fetchAllProducts());
        toast.success(data.payload.message || "Product saved successfully");
      } else {
        toast.error("Failed to save product");
      }
    });
  }

  function handleDelete(productId) {
    if (!productId) {
      toast.error("Product id is missing");
      return;
    }

    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success(data.payload.message || "Product deleted successfully");
        return;
      }
      toast.error(data?.payload?.message || "Failed to delete product");
    });
  }

  useEffect(() => { dispatch(fetchAllProducts()); }, [dispatch]);

  return (
    <div className="w-full p-8 bg-zinc-950 min-h-screen font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] -z-10" />

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          {/* <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-orange-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Inventory Management</span>
          </div> */}
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">
            Product <span className="text-orange-600">Catalog</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium text-sm uppercase tracking-wider">
            Control and expand your retail ecosystem.
          </p>
        </div>

        <Button
          onClick={() => {
            resetProductForm();
            setOpenCreateProductsDialog(true);
          }}
          className="h-12 px-8 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest italic transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:translate-y-[-2px] active:translate-y-0"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {productList?.length > 0 ? (
          productList.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center">
            <PackageSearch className="h-20 w-20 text-zinc-800 mb-4" />
            <p className="text-zinc-600 font-black uppercase tracking-[0.2em]">No products found in BillaMart database.</p>
          </div>
        )}
      </div>

      {/* Editor Sheet */}
      <Sheet open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
        <SheetContent side="right" className="w-full overflow-auto bg-zinc-950 border-l border-zinc-900 sm:max-w-md p-8 shadow-2xl">
          <SheetHeader className="mb-10 text-left">
            <div className="h-1 w-12 bg-orange-600 mb-4 rounded-full" />
            <SheetTitle className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none">
              Product <span className="text-orange-600">Manager</span>
            </SheetTitle>
            <SheetDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest pt-2">
              Update details or deploy new items to stock.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-10">
            <div className="p-1 rounded-[24px] bg-zinc-900/50 border border-zinc-800 shadow-inner">
               <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
              />
            </div>
            
            <div className="bg-zinc-900/30 p-6 rounded-[32px] border border-zinc-900/50 backdrop-blur-xl">
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                buttonText={isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" /> 
                    <span>Deploying...</span>
                  </div>
                ) : (currentEditedId ? "Commit Changes" : "Save to Inventory")}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
