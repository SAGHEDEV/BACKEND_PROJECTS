export class AppError extends Error {
    statusCode: number;
    constructor(message: string, status: number = 400) {
        super(message);
        this.name = "AppError";
        this.statusCode = status;
    }
}

const handleError = (err: Error & { statusCode?: number }, _req: any, res: any, _next: any) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    console.error(err);

    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
    });
}

export default handleError;