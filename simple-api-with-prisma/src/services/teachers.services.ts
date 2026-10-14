import prisma from "../lib/prisma.js"
import { AppError } from "../middleware/error.middleware.js"

const handleCreateTeacher = async ({ name, email }: Omit<Teacher, "id" | "createdAt">) => {
    const teacher = await prisma.teacher.create({
        data: {
            name: name,
            email: email
        }
    })
    return {
        message: "Teacher created successfully",
        success: true,
        data: teacher
    }
}

const handleGetAllTeachers = async ({ limit, page, search }: { limit: number, page: number, search?: string }) => {
    const [teachers, totalTeachers] = await Promise.all([
        prisma.teacher.findMany({
            take: limit,
            skip: (page - 1) * limit,
            where: {
                OR: [
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        email: {
                            contains: search
                        }
                    }
                ]
            }
        }),
        prisma.teacher.count()])

    return {
        message: "Teachers fetched successfully",
        success: true,
        data: teachers,
        page: page,
        limit: limit,
        total: totalTeachers
    }
}

const handleGetTeacherById = async (id: number) => {
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: id
        }
    })

    if (!teacher) {
        throw new AppError("Teacher not found", 404)
    }

    return {
        message: "Teacher fetched successfully",
        success: true,
        data: teacher
    }
}

const handleGetAllTeacherCourses = async (id: number, { limit, page }: { limit: number, page: number }) => {
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: id
        },
        include: {
            courses: {
                take: limit,
                skip: (page - 1) * limit
            }
        }
    })

    if (!teacher) {
        throw new AppError("Teacher not found", 404)
    }

    const totalCourses = await prisma.course.count({
        where: {
            teacherId: id
        }
    })

    return {
        message: "Teacher's courses fetched successfully",
        success: true,
        data: teacher.courses,
        page: page,
        limit: limit,
        total: totalCourses
    }
}

export {
    handleCreateTeacher,
    handleGetAllTeachers,
    handleGetTeacherById,
    handleGetAllTeacherCourses
}