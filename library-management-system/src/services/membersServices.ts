import { borrowings, members } from "../data/index.js";
import { AppError } from "../middlewares/error.middleware.js";

const handleGetAllMembers = ({ limit = 10, page = 1 }: { limit?: number; page?: number }) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = members.slice(startIndex, endIndex);
    const totalPages = Math.ceil(members.length / limit);
    return {
        data: paginatedMembers,
        page: page,
        limit: limit,
        total: members.length,
        totalPages: totalPages
    }
}

const handleGetMemberById = (id: number) => {
    const member = members.find((member) => member.id === id);
    if (!member) {
        throw new AppError(`Member not found`, 404);
    }
    return member;
}

const handleAddMember = (member: { name: string; email: string }) => {
    const emailExist = members.find((existingMember) => existingMember.email === member.email);
    if (emailExist) {
        throw new AppError(`Member with email ${member.email} already exists`, 400);
    }
    const newMember = {
        ...member,
        id: members.length + 1,
    }
    members.push(newMember);
    return newMember;
}

const handleUpdateMember = (id: number, updatedMember: Partial<Omit<Member, 'id'>>) => {
    const index = members.findIndex(member => member.id === id);
    if (index === -1) {
        throw new AppError(`Member not found!`, 404);
    }

    const emailExist = updatedMember.email ? members.find((existingMember) => existingMember.email === updatedMember.email && existingMember.id !== id) : false;
    if (emailExist) {
        throw new AppError(`Member with email ${updatedMember.email} already exists`, 400);
    }

    // Merges existing member with only the defined fields in updatedMember
    const updatedMemberData: Member = {
        ...members[index],
        ...updatedMember,
    } as Member;

    members[index] = updatedMemberData;

    return updatedMemberData;
}

const handleDeleteMember = (id: number) => {
    const memberIndex = members.findIndex(member => member.id === id);
    if (memberIndex === -1) {
        throw new AppError(`Member with ID ${id} not found!`, 404);
    }
    const deletedMember = members.splice(memberIndex, 1)[0];
    return deletedMember;
}

const handleGetAllMemberBorrowings = ({ id, limit = 10, page = 1 }: { id: number; limit?: number; page?: number }) => {
    const memberExists = members.find((member) => member.id === id);
    if (!memberExists) {
        throw new AppError(`Member not found`, 404);
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const filteredBorrowings = borrowings.filter((borrowing) => borrowing.borrowerId === id);
    const paginatedBorrowings = filteredBorrowings.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredBorrowings.length / limit);
    return {
        data: paginatedBorrowings,
        page: page,
        limit: limit,
        total: filteredBorrowings.length,
        totalPages: totalPages
    };
}

export { handleGetAllMembers, handleGetMemberById, handleAddMember, handleUpdateMember, handleDeleteMember, handleGetAllMemberBorrowings };