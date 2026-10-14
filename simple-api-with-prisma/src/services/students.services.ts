import prisma from "../lib/prisma.js"
import { AppError } from "../middleware/error.middleware.js"

const handleCreateStudent = async ({ name, email }: Omit<Student, "id" | "enrollemnts" | "createdAt">) => {
    const student = await prisma.student.create({
        data: {
            name: name,
            email: email
        }
    })
    return {
        message: "Student created successfully",
        success: true,
        data: student
    }
}

const handleGetAllStudents = async ({ limit, page, search }: { limit: number, page: number, search?: string }) => {
    const [students, totalStudents] = await Promise.all([
        prisma.student.findMany({
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
        prisma.student.count()])

    return {
        message: "Students fetched successfully",
        success: true,
        data: students,
        page: page,
        limit: limit,
        total: totalStudents
    }
}

const handleGetStudentById = async (id: number) => {
    const student = await prisma.student.findUnique({
        where: {
            id: id
        },
        include: {
            enrollemnts: true
        }
    })

    if (!student) {
        throw new AppError("Student not found", 404)
    }

    return {
        message: "Student fetched successfully",
        success: true,
        data: student
    }
}

const handleGetAllStudentEnrollments = async (id: number, status?: string) => {
    const student = await prisma.student.findUnique({
        where: {
            id: id,
            status: status ? status as "active" | "inactive" : undefined
        },
        include: {
            enrollemnts: true
        },
        select: {
            enrollemnts: true
        }
    })

    if (!student) {
        throw new AppError("Student not found", 404)
    }

    return {
        message: "Student enrollments fetched successfully",
        success: true,
        data: student.enrollemnts
    }
}

const handleUpdateStudent = async (id: number, { name }: {name: string}) => {
    const student = await prisma.student.update({
        where: {
            id: id
        },
        data: {
            name: name,
        }
    })

    if (!student) {
        throw new AppError("Student not found", 404)
    }

    return {
        message: "Student updated successfully",
        success: true,
        data: student
    }
}

const handleDeleteStudent = async (id: number) => {
    const student = await prisma.student.delete({
        where: {
            id: id
        }
    })

    if (!student) {
        throw new AppError("Student not found", 404)
    }

    return {
        message: "Student deleted successfully",
        success: true,
        data: student
    }
}

export { handleCreateStudent, handleGetAllStudents, handleGetStudentById, handleGetAllStudentEnrollments, handleUpdateStudent, handleDeleteStudent }