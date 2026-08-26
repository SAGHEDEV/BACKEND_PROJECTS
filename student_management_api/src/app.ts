import express from "express";

interface Student {
    id: string;
    name: string;
    email: string;
    age: number;
    course: string;
}

const app = express();
const router = express.Router();

app.use(express.json());
app.use("/api", router)

const students: Student[] = []

router.route("/students")
    .get((req, res) => {
        res.status(200).json({ students });
    })
    .post((req, res) => {
        const student = req.body;
        if (student && student.name && student.email && student.age && student.course) {
            const studentAlreadyExist = students.find((s) => s.email === student.email);
            if (studentAlreadyExist) {
                return res.status(400).json({ message: "Student already exists" });
            }
            const id = crypto.randomUUID();
            student.id = id;
            students.push(student);
            res.status(201).json({ message: "Student added successfully", student });
        } else {
            res.status(400).json({ message: "Invalid student data" });
        }
    });

router.route("/students/:id")
    .get((req, res) => {
        const student = students.find((s) => s.id === req.params.id);
        if (student) {
            res.status(200).json({ student });
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    })
    .put((req, res) => {
        const student = req.body;
        if (student && student.name && student.email && student.age && student.course) {
            const studentIndex = students.findIndex((s) => s.id === req.params.id);
            if (studentIndex === -1) {
                return res.status(404).json({ message: "Student not found" });
            }
            students[studentIndex] = { ...student, id: req.params.id };
            res.status(200).json({ message: "Student updated successfully", student: students[studentIndex] });
        } else {
            res.status(400).json({ message: "Invalid student data" });
        }
    })
    .patch((req, res) => {
        const student = req.body;
        if (student) {
            const studentIndex = students.findIndex((s) => s.id === req.params.id);
            const targetStudent = students[studentIndex];
            if (!targetStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            const name = student?.name;
            const email = student?.email;
            const age = student?.age;
            const course = student?.course;

            if (name) targetStudent.name = name;
            if (email) targetStudent.email = email;
            if (age) targetStudent.age = age;
            if (course) targetStudent.course = course;

            res.status(200).json({ message: "Student updated successfully", student: targetStudent });
        } else {
            res.status(400).json({ message: "Invalid student data" });
        }
    })
    .delete((req, res) => {
        const studentIndex = students.findIndex((s) => s.id === req.params.id);
        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not found" });
        }
        const [deletedStudent] = students.splice(studentIndex, 1);
        res.status(200).json({ message: "Student deleted successfully", student: deletedStudent });
    });

export default app