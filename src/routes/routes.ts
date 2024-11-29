import express from "express";
import { login, register, changePassword } from "../controllers/authController";
import { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { getAllInvoices, getSingleInvoice, createInvoice, updateInvoice, deleteInvoice } from "../controllers/invoiceController";

const router = express.Router();

// Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/change-password", changePassword);

// Product Routes
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Invoice Routes
router.get("/invoices", getAllInvoices);
router.get("/invoices/:id", getSingleInvoice);
router.post("/invoices", createInvoice);
router.patch("/invoices/:id", updateInvoice);
router.delete("/invoices/:id", deleteInvoice);


export default router;
