import { Router, Request, Response } from "express";
import { ApiResponse } from "../types";

const router = Router();

// GET /example
router.get("/", (req: Request, res: Response<ApiResponse>) => {
    res.json({
        success: true,
        data: {
            message: "Hello from the example endpoint!",
            timestamp: new Date().toISOString(),
        },
    });
});

// GET /example/:id
router.get("/:id", (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    res.json({
        success: true,
        data: {
            id,
            message: `You requested item with ID: ${id}`,
            timestamp: new Date().toISOString(),
        },
    });
});

// POST /example
router.post("/", (req: Request, res: Response<ApiResponse>) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Name is required",
            },
        });
    }

    return res.status(201).json({
        success: true,
        data: {
            id: Math.random().toString(36).substr(2, 9),
            name,
            description,
            createdAt: new Date().toISOString(),
        },
    });
});

export const exampleRouter = router;
