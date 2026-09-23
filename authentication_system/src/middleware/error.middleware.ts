export class AppError extends Error {
    statusCode: number;
    constructor(message: string, status: number = 400) {
        super(message);
        this.name = "AppError";
        this.statusCode = status;
    }
}

const handleError = (err: AppError, _req: any, res: any, _next: any) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}

export default handleError;