import type { NextFunction, Request, Response } from "express"

const logRequests = (req: Request, _res: Response, next: NextFunction) => {
    console.log(`[REQUEST] - ${req.method} - ${req.url}`)
    next?.()
}

export default logRequests
