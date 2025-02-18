"use client";

import { useState, useRef } from "react";
import { useProduct } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

import { IoMdCloseCircle } from "react-icons/io";

import {
  BAIML_CATEGORIES,
  TOXIC_SHINE_CATEGORIES,
  STORE_CATEGORIES,
  STORE_SUBCATEGORIES,
} from "@/constants/categories";

function DashboardPage() {
  const { allProducts, fetchAllProducts } = useProduct();

  const { fetchCart } = useCart();

  const baimlOptions = [...BAIML_CATEGORIES];
  const toxicShineOptions = [...TOXIC_SHINE_CATEGORIES];
  const storeOptions = [...STORE_CATEGORIES];
  const storeSubcategorieOptions = [...STORE_SUBCATEGORIES];

  const [name, setName] = useState("");
  const [nameForOrders, setNameForOrders] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("");
  const [unit, setUnit] = useState("");
  const [productSet, setProductSet] = useState("");
  const [variantSubCategory, setVariantSubCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  const imageInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (kind === "Baiml") {
      formData.append("name", name);
      formData.append("nameForOrders", nameForOrders);
      formData.append("sku", sku);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("unit", unit);
      formData.append("kind", kind);
      formData.append("productSet", productSet);
    }

    if (kind === "Store") {
      formData.append("name", name);
      formData.append("nameForOrders", nameForOrders);
      formData.append("sku", sku);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("description", description);
      formData.append("unit", unit);
      formData.append("kind", kind);
      if(subCategory === "Cables TPR" || subCategory === "Enchufes"){
        formData.append("variantSubCategory", variantSubCategory);
      }
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setError(false);
      setSuccess(false);
      await axios.post("/api/products", formData);
      setSuccess(true);

      setName("");
      setNameForOrders("");
      setSku("");
      setCategory("");
      setSubCategory("");
      setDescription("");
      setUnit("");
      setKind("");
      setProductSet("");
      setImages([]);

      const urlsToRevoke = [...imageUrls];
      setImageUrls([]);

      if (imageInputRef.current) {
        imageInputRef.current.value = null;
      }

      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      fetchAllProducts();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages((prevImages) => [...prevImages, ...files]);

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImageUrls((prevUrls) => [...prevUrls, ...newImageUrls]);

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      await fetchCart();
      fetchAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormFocus = (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "SELECT"
    ) {
      setError(false);
      setSuccess(false);
    }
  };

  return (
    <div>
      <div className="pb-8 px-4 mx-auto mb-7 max-w-full lg:pb-16">
        <div className="flex justify-center w-full">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Agregar un Producto Nuevo
          </h2>
        </div>
        <form onSubmit={handleSubmit} onFocus={handleFormFocus}>
          <div className="grid gap-4 sm:grid-cols-6 sm:gap-3">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                placeholder="Faro Baiml 1035.A"
                name="name"
                value={name}
                autoComplete="name"
                required={true}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-600 block w-full p-2.5 "
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="nameForOrders"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Nombre Para Pedidos
              </label>
              <input
                type="text"
                placeholder="FARO 1035.A"
                name="nameForOrders"
                value={nameForOrders}
                autoComplete="off"
                required={true}
                onChange={(e) => setNameForOrders(e.target.value)}
                id="nameForOrders"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-600 block w-full p-2.5 "
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="sku"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sku
              </label>
              <input
                type="text"
                placeholder="sku"
                name="sku"
                value={sku}
                autoComplete="sku"
                required={true}
                onChange={(e) => setSku(e.target.value)}
                id="sku"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="kind-options"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tipo de Producto
              </label>
              <select
                id="kind-options"
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" disabled hidden>
                  Tipo
                </option>
                <option value={"Baiml"}>Baiml</option>
                <option value={"Store"}>Producto de la Tienda</option>
              </select>
            </div>

            <div className="w-full">
              <label
                htmlFor="unit"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Unidad
              </label>
              <input
                type="number"
                placeholder="12"
                name="unit"
                value={unit}
                autoComplete="unit"
                required={true}
                onChange={(e) => setUnit(e.target.value)}
                id="unit"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {kind === "Baiml" && (
              <>
                <div>
                  <label
                    htmlFor="baiml-options"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Categoria
                  </label>
                  <select
                    id="baiml-options"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" disabled hidden>
                      Categoria
                    </option>
                    {baimlOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="ProductSet"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Juegos
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    name="productSet"
                    value={productSet}
                    autoComplete="set"
                    required={true}
                    onChange={(e) => setProductSet(e.target.value)}
                    id="ProductSet"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {kind === "Store" && (
              <>
                <div>
                  <label
                    htmlFor="baiml-options"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Categoria
                  </label>
                  <select
                    id="store-options"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" disabled hidden>
                      Categoria
                    </option>
                    {storeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {category === "Toxic Shine" && (
                  <div>
                    <label
                      htmlFor="toxic-options"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Sub Categoria
                    </label>
                    <select
                      id="toxic-options"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="" disabled hidden>
                        Sub Categoria
                      </option>
                      {toxicShineOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {category !== "Toxic Shine" && (
                  <>
                    <div>
                      <label
                        htmlFor="store-subcategory-options"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Sub Categoria
                      </label>
                      <select
                        id="store-subcategory-options"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="" disabled hidden>
                          Sub Categoria
                        </option>
                        {storeSubcategorieOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    {subCategory === "Cables TPR" && (
                      <div>
                      <label
                        htmlFor="store-variantsubcategory-options"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Variante de Sub Categoria
                      </label>
                      <select
                        id="store-subcategory-options"
                        value={variantSubCategory}
                        onChange={(e) => setVariantSubCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="" disabled hidden>
                          Varianta de Sub Categoria
                        </option>
                        {["Coelpla","Milenio"].map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    )}

                    {subCategory === "Enchufes" && (
                      <div>
                      <label
                        htmlFor="store-variantsubcategory-options"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Variante de Sub Categoria
                      </label>
                      <select
                        id="store-subcategory-options"
                        value={variantSubCategory}
                        onChange={(e) => setVariantSubCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="" disabled hidden>
                          Varianta de Sub Categoria
                        </option>
                        {["Enchufe de Plastico","Enchufe de Aluminio","Enchufe Vulcanizado"].map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    )}
                  </>
                )}
              </>
            )}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Descripcion del Producto
              </label>
              <textarea
                type="text"
                placeholder="Unipolar Peso aprox.: Unidad: 90 g Caja x 12: 1230 g"
                name="description"
                value={description}
                autoComplete="description"
                required={true}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                rows="11"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="file-upload"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Imágenes del Producto
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
                className="hidden"
                id="file-upload"
              />

              {/* Botón Estilizado */}
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg cursor-pointer hover:bg-red-800"
              >
                Seleccionar imágenes
              </label>
              {imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 text-red-500 text-lg"
                      >
                        <IoMdCloseCircle />
                      </button>

                      <Image
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        width={210}
                        height={210}
                        className="rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-600 hover:bg-red-800 rounded-lg "
            >
              Añadir Producto
            </button>
          </div>
          {success && (
            <div className="flex justify-center w-full">
              <p className="text-lg text-green-600 font-semibold">
                Producto agregado correctamente!
              </p>
            </div>
          )}
          {error && (
            <div className="flex justify-center w-full">
              <p className="text-lg text-red-600 font-semibold">{error}</p>
            </div>
          )}
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Nombre Para Pedidos</th>
            <th>Sku</th>
            <th>Categoria</th>
            <th>SubCategoria</th>
            <th>Unidad</th>
            <th>Juegos</th>
            <th>Imágenes</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((prod) => (
            <tr key={prod.productId}>
              <td>{prod.productId}</td>
              <td>{prod.name}</td>
              <td>{prod.nameForOrders}</td>
              <td>{prod.sku}</td>
              <td>{prod.category}</td>
              <td>{prod.subCategory}</td>
              <td>{prod.unit}</td>
              <td>{prod.productSet}</td>
              <td>
                {prod.images?.map((img, index) => (
                  <Image
                    key={index}
                    src={img.url}
                    alt={`Imagen ${index}`}
                    width={50}
                    height={50}
                  />
                ))}
              </td>
              <td>
                <button onClick={() => handleDelete(prod.productId)}>
                  Eliminar
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    router.push(`/admin/editProduct/${prod.productId}`)
                  }
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardPage;
