// Interfaces
interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    rememberToken?: string;
    emailVerifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface IProfile {
    id: number;
    userId: number;
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ICategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IProduct {
    id: number;
    categoryId: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

// Class implementations
export class User implements IUser {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public password: string,
        public rememberToken?: string,
        public emailVerifiedAt?: Date,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}

export class Profile implements IProfile {
    constructor(
        public id: number,
        public userId: number,
        public avatar?: string,
        public bio?: string,
        public phone?: string,
        public address?: string,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
} 