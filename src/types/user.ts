export interface User {
  id: string
  fullname: string
  department: string
  email: string
  lemons: number
  diamonds: number
  status: UserStatus
  role: UserRole
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
