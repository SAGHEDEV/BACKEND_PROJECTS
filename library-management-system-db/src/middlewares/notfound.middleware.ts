import type { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ message: `The path "${req.path}" was not found`, success: false });
};

export default notFoundHandler;
