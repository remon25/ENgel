import ProductItemPriceProps from "../layout/ProductItemPriceProps";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductForm({
  handleFormSubmit,
  productItem,
  editForm = false,
}) {
  const [bannerImage, setBannerImage] = useState(
    productItem?.bannerImage || ""
  );
  const [moreImages, setMoreImages] = useState(productItem?.moreImages || []);
  const [name, setName] = useState(productItem?.name || "");
  const [price, setPrice] = useState(productItem?.price || "");
  const [beforeSalePrice, setBeforeSalePrice] = useState(productItem?.beforeSalePrice || "");
  const [code, setCode] = useState(productItem?.code || "");
  const [stock, setStock] = useState(productItem?.stock || "");
  const [description, setDescription] = useState(
    productItem?.description || ""
  );
  const [sizes, setSizes] = useState(productItem?.sizes || []);
  const [category, setCategory] = useState(productItem?.category || "");
  const [extraIngredientPrice, setExtraIngredientPrice] = useState(
    productItem?.extraIngredientPrice || []
  );
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (!category && data.length > 0) {
          setCategory(data[0]._id);
        }
      });
  }, [category]);

  const handleRemoveImage = (index) => {
    setMoreImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  function resetForm() {
    setBannerImage("");
    setMoreImages([]);
    setName("");
    setPrice("");
    setBeforeSalePrice("");
    setStock("");
    setDescription("");
    setSizes([]);
    setCategory(categories[0]?._id || "");
    setExtraIngredientPrice([]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      await handleFormSubmit(e, {
        code,
        bannerImage,
        moreImages,
        name,
        price,
        beforeSalePrice,
        stock,
        description,
        category,
        sizes,
        extraIngredientPrice,
      });

      // Only reset form after successful submission
      if (!editForm) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 p-4" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row gap-2 items-center md:items-start">
        {/* Banner Image Upload */}
        <div className="w-full flex items-start gap-2 md:w-auto justify-center">
          <div className="p-2 rounded-lg flex flex-col items-center">
            <Image
              className="rounded-lg"
              src={bannerImage || "/default-menu.png"}
              alt="Banner Image"
              width={120}
              height={120}
            />
            <CldUploadWidget
              options={{
                sources: ["local"],
                maxFiles: 1,
                resourceType: "image",
              }}
              onSuccess={(results) => setBannerImage(results?.info?.secure_url)}
              signatureEndpoint="/api/upload"
            >
              {({ open }) => (
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="block border border-gray-300 mt-2 cursor-pointer rounded-lg p-2 text-[0.7rem] text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => open()}
                >
                  Upload Banner Image
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        {/* More Images Upload */}
        <div className="flex flex-wrap gap-2">
          {moreImages.map((image, index) => (
            <div key={index} className="relative">
              <Image
                className="rounded-lg"
                src={image}
                alt={`More Image ${index + 1}`}
                width={80}
                height={80}
              />
              <button
                type="button"
                disabled={isSubmitting}
                className="absolute top-0 right-0 bg-red-500 text-white text-sm rounded-full px-1 disabled:opacity-50"
                onClick={() => handleRemoveImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
          <CldUploadWidget
            options={{
              sources: ["local"],
              maxFiles: 7 - moreImages.length,
              resourceType: "image",
            }}
            onSuccess={(results) => {
              if (Array.isArray(results)) {
                setMoreImages((prev) => [
                  ...prev,
                  ...results.map((result) => result?.info?.secure_url),
                ]);
              } else if (results?.info?.secure_url) {
                setMoreImages((prev) => [...prev, results.info.secure_url]);
              } else {
                console.error("Unexpected results format:", results);
              }
            }}
            signatureEndpoint="/api/upload"
          >
            {({ open }) => (
              <button
                type="button"
                disabled={isSubmitting}
                className="block border border-gray-300 mt-2 cursor-pointer rounded-lg p-2 text-[0.7rem] text-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => open()}
              >
                Upload More Images
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Other Fields */}
        <div className="grow pb-4 w-full md:w-auto">
          <label htmlFor="productItemName">Product Name</label>
          <input
            id="productItemName"
            type="text"
            placeholder="Product Name"
            value={name}
            disabled={isSubmitting}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Description"
            value={description}
            disabled={isSubmitting}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            disabled={isSubmitting}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          <label htmlFor="code">Code</label>
          <input
            id="code"
            type="text"
            placeholder="code"
            value={code}
            disabled={isSubmitting}
            onChange={(e) => setCode(e.target.value)}
          />
          <label htmlFor="basePrice">Base Price</label>
          <input
            id="basePrice"
            type="number"
            placeholder="Price"
            value={price}
            disabled={isSubmitting}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label htmlFor="beforeSalePrice">Before sale price</label>
          <input
            id="beforeSalePrice"
            type="number"
            placeholder="Before sale price"
            value={beforeSalePrice}
            disabled={isSubmitting}
            onChange={(e) => setBeforeSalePrice(e.target.value)}
          />

          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            placeholder="Stock"
            value={stock}
            disabled={isSubmitting}
            onChange={(e) => setStock(e.target.value)}
          />

          <ProductItemPriceProps
            addLabel={"Größe des Artikels hinzufügen"}
            name={"Größen"}
            props={sizes}
            setProps={setSizes}
            disabled={isSubmitting}
          />

          <button 
            className="rounded-xl p-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Speichern..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}