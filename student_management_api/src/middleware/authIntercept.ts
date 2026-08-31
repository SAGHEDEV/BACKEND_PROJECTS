import type { NextFunction, Request, Response } from "express";

const handleAuthIntercept = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log(token)
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const tokenApporved = token == "x-api-key";
        if (!tokenApporved) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
}

export { handleAuthIntercept }