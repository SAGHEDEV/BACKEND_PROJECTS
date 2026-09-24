import type { User } from "./index.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: User["role"];
            };
        }
    }
}

export {};