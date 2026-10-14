import prisma from "../lib/prisma.js"
import { AppError } from "../middleware/error.middleware.js"

const handleCreateCourse = async (courseData: Omit<Course, "id" | "createdAt">) => {
    const course = await prisma.course.create({
        data: courseData
    })

    return {
        message: "Course created successfully",
        success: true,
        data: course
    }
}

const handleGetAllCourses = async ({ limit, page, search }: { limit: number, page: number, search: string }) => {
    const [courses, totalCourses] = await Promise.all([
        prisma.course.findMany({
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
                        code: {
                            contains: search
                        }
                    }
                ]
            }
        }),
        prisma.course.count()
    ])

    return {
        message: "Courses fetched successfully",
        success: true,
        data: courses,
        page: page,
        limit: limit,
        total: totalCourses
    }
}

const handleGetCourseById = async (id: number) => {
    const course = await prisma.course.findUnique({
        where: {
            id: id
        }
    })

    if (!course) {
        throw new AppError("Course not found", 404)
    }

    return {
        message: "Course fetched successfully",
        success: true,
        data: course
    }
}

const handleGetAllCourseEnrollment = async ({courseId, limit, page}: {courseId: number, limit: number, page: number})=>{
    const [enrollments, totalEnrollments] = await Promise.all([
        prisma.enrollment.findMany({
            where: {
                courseId: courseId
            },
            take: limit,
            skip: (page - 1) * limit
        }),
        prisma.enrollment.count({
            where: {
                courseId: courseId
            }
        })
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

export { handleCreateCourse, handleGetAllCourses, handleGetCourseById, handleGetAllCourseEnrollment }