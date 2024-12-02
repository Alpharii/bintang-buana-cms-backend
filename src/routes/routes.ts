import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { login, register, changePassword, getUserInfo, getAllUsers } from "../controllers/authController";
import { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { getAllInvoices, getSingleInvoice, createInvoice, updateInvoice, deleteInvoice } from "../controllers/invoiceController";
import { getAllCartItems, createCartItem, updateCartItem, deleteCartItem } from "../controllers/cartItemController";

const router = express.Router();

// Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/change-password", changePassword);
router.get("/user", getAllUsers)
router.get("/user/:id", authMiddleware, getUserInfo);

// Product Routes
router.get("/products", authMiddleware, getAllProducts);
router.get("/products/:id", authMiddleware, getSingleProduct);
router.post("/products", authMiddleware, createProduct);
router.patch("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);

// Invoice Routes
router.get("/invoices", authMiddleware, getAllInvoices);
router.get("/invoices/:id", authMiddleware, getSingleInvoice);
router.post("/invoices", authMiddleware, createInvoice);
router.patch("/invoices/:id", authMiddleware, updateInvoice);
router.delete("/invoices/:id", authMiddleware, deleteInvoice);

// CartItem Routes
router.get("/cart-items/:userId", authMiddleware, getAllCartItems); // Mengambil semua cartItems untuk pengguna tertentu
router.post("/cart-items", authMiddleware, createCartItem); // Menambahkan cart item
router.patch("/cart-items/:id", authMiddleware, updateCartItem); // Mengupdate cart item
router.delete("/cart-items/:id", authMiddleware, deleteCartItem); // Menghapus cart item

export default router;
