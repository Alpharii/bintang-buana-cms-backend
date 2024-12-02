// cartItemController.ts
import { Request, Response } from "express";
import prisma from "../middleware/prisma";

interface CartItemRequest extends Request {
    body: {
        userId: number;
        productId: number;
        quantity: number;
    };
}

// Mendapatkan semua cartItems untuk pengguna tertentu
export const getAllCartItems = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: Number(userId) },
            include: { product: true }, // Menampilkan produk terkait dengan cart item
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
};

// Menambahkan item ke dalam cart
export const createCartItem = async (req: CartItemRequest, res: Response) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cartItem = await prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
        res.status(201).json({ message: "Cart item created successfully", cartItem });
    } catch (error) {
        res.status(500).json({ message: "Failed to create cart item", error });
    }
};

// Mengupdate cartItem
export const updateCartItem = async (req: CartItemRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const cartItem = await prisma.cartItem.update({
            where: { id: Number(id) },
            data: { quantity },
        });
        res.status(200).json({ message: "Cart item updated successfully", cartItem });
    } catch (error) {
        res.status(500).json({ message: "Failed to update cart item", error });
    }
};

// Menghapus cartItem
export const deleteCartItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cartItem = await prisma.cartItem.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Cart item deleted successfully", cartItem });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete cart item", error });
    }
};
