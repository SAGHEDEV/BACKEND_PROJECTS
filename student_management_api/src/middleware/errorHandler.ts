import type { Response } from "express"

const handleErrorRequests = (error: Error, res: Response) => {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Kindly try again!";
    res.status(500).json({ message: errorMessage })
}

export default handleErrorRequests