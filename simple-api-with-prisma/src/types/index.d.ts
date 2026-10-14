interface Student {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    enrollemnts?: Enrollment[];
}

interface Teacher {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    courses?: Course[];
}

interface Course {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    teacherId: number;
}

interface Enrollment {
    id: number;
    studentId: number;
    courseId: number;
    enrolledAt: number;
    grade: "distinction" | "excellent" | "pass" | "fail";
    status: "active" | "inactive";
}

