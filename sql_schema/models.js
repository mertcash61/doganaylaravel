class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.rememberToken = data.rememberToken;
        this.emailVerifiedAt = data.emailVerifiedAt;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            emailVerifiedAt: this.emailVerifiedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

class Profile {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.avatar = data.avatar;
        this.bio = data.bio;
        this.phone = data.phone;
        this.address = data.address;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            avatar: this.avatar,
            bio: this.bio,
            phone: this.phone,
            address: this.address,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = {
    User,
    Profile
}; 