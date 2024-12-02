import { Request, Response } from "express";
import prisma from "../middleware/prisma";

interface Product extends Request {
    body: {
        name: string;
        price: number;
        description: string;
        image: string;
        discount: number;
        stock: number;
    };
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
}

export const createProduct = async (req: Product, res: Response) : Promise<void> => {
    try {
        const { name, price, description, image, discount, stock } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                image,
                discount,
                stock
            },
        });
        res.status(201).json({ message : "Product created successfully" , product});
        return
    } catch (error) {
        res.status(500).json({ message: "Failed to create product", error });
        return
    }
};

export const updateProduct = async (req: Product, res: Response) : Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, description, image, discount, stock } = req.body;
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                price,
                description,
                image,
                discount,
                stock
            },
        });
        res.status(200).json({ message : "Product updated successfully" , product});
        return
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error });
        return
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message : "Product deleted successfully" , product});
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product", error });
    }
};
