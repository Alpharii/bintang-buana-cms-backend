import { Request, Response } from "express";
import prisma from "../middleware/prisma";

interface InvoiceRequest extends Request {
    body: {
        invoiceNo: string;
        totalAmount: number;
        status: string;
        productIds: number[]; // Menyimpan ID produk yang terkait dengan invoice
    };
}

// Mendapatkan semua invoice
export const getAllInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                products: true, // Memasukkan informasi produk yang terkait
            },
        });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
};

// Mendapatkan invoice berdasarkan ID
export const getSingleInvoice = async (req: Request, res: Response) : Promise<void> => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({
            where: { id: Number(id) },
            include: { products: true }, // Menampilkan produk yang terkait
        });
        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch invoice" });
    }
};

// Membuat invoice baru
export const createInvoice = async (req: InvoiceRequest, res: Response) => {
    try {
        const { invoiceNo, totalAmount, status, productIds } = req.body;
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNo,
                totalAmount,
                status,
                products: {
                    connect: productIds.map((id) => ({ id })), // Menghubungkan produk yang ada berdasarkan ID
                },
            },
        });
        res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Failed to create invoice", error });
    }
};

// Mengupdate invoice
export const updateInvoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { invoiceNo, totalAmount, status, productIds } = req.body;
        const invoice = await prisma.invoice.update({
            where: { id: Number(id) },
            data: {
                invoiceNo,
                totalAmount,
                status,
                products: {
                    connect: productIds.map((id: number) => ({ id })), // Menambahkan produk baru ke invoice
                },
            },
        });
        res.status(200).json({ message: "Invoice updated successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Failed to update invoice", error });
    }
};

// Menghapus invoice
export const deleteInvoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Invoice deleted successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete invoice", error });
    }
};
