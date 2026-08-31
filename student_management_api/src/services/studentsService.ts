import { studentsList } from "../data/students.ts";
import handleErrorRequests from "../middleware/errorHandler.ts";
import type { Student } from "../types/index.js";

const handleGetStudents = ({ limit = 10, page = 1 }: { limit?: string | number, page?: string | number }) => {
    try {
        console.log({ limit, page, studentsList })
        const totalStudents = studentsList.length;
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedStudents = studentsList.slice(skip, skip + Number(limit));

        return {
            students: paginatedStudents,
            totalStudents,
            currentPage: page,
            totalPages: Math.ceil(totalStudents / Number(limit)),
            limit: limit
        }
    } catch (error) {
        throw new Error("Error fetching students: " + error)
    }
};

const handleGetSungleUser = (id: string) => {
    if (!id) throw new Error("Invalid student id")
    const student = studentsList.find((s) => s.id === id);
    if (!student) {
        throw new Error("Student not found");
    }
    return student;
}

const handleCreateStudent = (student: Student) => {
    student.id = crypto.randomUUID();
    studentsList.push(student);
    return student;
}

const handleUpdateStudent = (id: string, student: Student) => {
    const studentToUpdate = studentsList.find((s) => s.id === id);
    if (!studentToUpdate) {
        throw new Error("Student not found");
    }
    studentToUpdate.name = student.name;
    studentToUpdate.age = student.age;
    studentToUpdate.courses = student.courses;
    return studentToUpdate;
}

const handleDeleteStudent = (id: string) => {
    const studentToDelete = studentsList.find((s) => s.id === id);
    if (!studentToDelete) {
        throw new Error("Student not found");
    }
    studentsList.splice(studentsList.indexOf(studentToDelete), 1);
    return studentToDelete;
}

const handleBultDelete = (ids: string[]) => {
    for (const id of ids) {
        handleDeleteStudent(id);
    }
    return true;
}


export { handleGetStudents, handleCreateStudent, handleUpdateStudent, handleDeleteStudent, handleBultDelete, handleGetSungleUser }