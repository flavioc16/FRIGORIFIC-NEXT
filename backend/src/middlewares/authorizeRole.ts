import { NextFunction, Request, Response } from "express";

// Middleware para verificar se o usuário tem a role necessária
export function authorizeRole(requiredRole: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.role;

        if (userRole !== requiredRole) {
            return res.status(403).json({ error: "Access denied" }); // Forbidden
        }

        next();
    };
}
