// constants/user.js

const ROLES = Object.freeze({
    ADMIN: 'admin',
    PARTICIPANT: 'participant',
    GUEST: 'guest'
});

const STATUS = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
});

// Ekspor keduanya sekaligus
module.exports = {
    ROLES,
    STATUS
};