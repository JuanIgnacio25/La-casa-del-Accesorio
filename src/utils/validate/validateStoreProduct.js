import { Type } from "@sinclair/typebox";
import Ajv from "ajv";
import addErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true })
  .addKeyword("kind")
  .addKeyword("modifier");
addErrors(ajv);

const storeProductDtoSchema = Type.Object(
  {
    name: Type.String({
      minLength: 2,
      errorMessage: {
        type: "Name debe ser un String",
        minLength: "Name debe tener más de un carácter",
      },
    }),
    sku: Type.String({
      errorMessage: {
        type: "Sku debe ser un String",
      },
    }),
    category: Type.String({
      errorMessage: {
        type: "Category debe ser un String",
      },
    }),
    subCategory: Type.String({
      errorMessage: {
        type: "Category debe ser un String",
      },
    }),
    description: Type.String({
      errorMessage: {
        type: "Description debe ser un String",
      },
    }),
    unit: Type.String({
      errorMessage: {
        type: "Unit debe ser String",
      },
    }),
    kind: Type.String({
      errorMessage: {
        type: "Kind debe ser String",
      },
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "No debe tener propiedades adicionales",
      required: {
        name: "Falta la propiedad: name",
        sku:"Falta la propiedad sku",
        category: "Falta la propiedad: category",
        subCategory:"Falta la propiedad: subCategory",
        description: "Falta la propiedad: description",
        unit: "Falta la propiedad: unit",
        kind: "Falta la propiedad: kind"
      },
    },
  }
);

const validateStoreProduct = ajv.compile(storeProductDtoSchema);

export const isValidStoreProduct = (product) => {
  try {
    const isValid = validateStoreProduct(product);
    if (!isValid) {
      throw new Error(ajv.errorsText(validateStoreProduct.errors));
    }
  } catch (error) {
    throw error;
  }
};