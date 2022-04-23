enum Role {
  // This user accesses app features.
  BASIC = 1,

  // Can only read some data.
  VISITOR = 2,

  // This is some platform features. This user can only create basic users. It is limited to read, create or delete.
  MANAGER = 4,

  // This user has maximum access to all platform features. This user can be deleted. This user can only create admins, managers and basic users.
  ADMIN = 8,

  // This user has maximum access to all platform features. This user cannot be deleted. This user can only create admin users.
  SUPER = 16,
}

export default Role
