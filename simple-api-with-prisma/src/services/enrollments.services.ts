import type { Prisma } from "@prisma/client/extension"
import prisma from "../lib/prisma.js"
import { AppError } from "../middleware/error.middleware.js"

const handleStudentEnrollment = async (studentId: number, courseId: number) => {
    const enrollment = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const student = await tx.student.findUnique({
            where: {
                id: studentId
            }
        })
        if (!student) {
            throw new AppError("Student not found", 403)
        }
        const course = await tx.course.findUnique({
            where: {
                id: courseId
            }
        })

        if (!course) {
            throw new AppError("Course not found", 403)
        }

        const existingEnrollment = await tx.enrollment.findFirst({
            where: {
                studentId: studentId,
                courseId: courseId
            }
        })

        if (existingEnrollment) {
            throw new AppError("Student is already enrolled in this course", 403)
        }

        const enrollment = await tx.enrollment.create({
            data: {
                studentId: studentId,
                courseId: courseId,
            }
        })
        return enrollment
    })

    return {
        message: "Student enrolled successfully",
        success: true,
        data: enrollment
    }
}

const handleGetAllEnrollments = async ({ limit, page }: { limit: number, page: number }) => {
    const [enrollments, totalEnrollments] = await Promise.all([
        prisma.enrollment.findMany({
            take: limit,
            skip: (page - 1) * limit,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                course: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            }
        }),
        prisma.enrollment.count()
    ])

    return {
        message: "Enrollments fetched successfully",
        success: true,
        data: enrollments,
        page: page,
        limit: limit,
        total: totalEnrollments
    }
}

export { handleStudentEnrollment, handleGetAllEnrollments }