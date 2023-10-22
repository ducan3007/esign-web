export type UserType = {
  id: string
  email: string
  first_name: string
  last_name: string
  group_id?: string
  password?: string
  user_role?: {
    name: string
    id: number
  }
  permission?: UserPermission[]
  is_active?: boolean
  is_registered?: boolean
  is_verified?: boolean
  is_master_group?: boolean
  wallet_address: any[]
  createdAt?: Date
  updatedAt?: Date
}

export type UserPermission = {
  role_id: number
  feature: {
    name: string
  }
  permission_id: number
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
  Accountant = 'Accountant',
  Viewer = 'Viewer',
  Certificant = 'Certificant',
  Signer = 'Signer',
}

const default_feature_permission = {
  Admin: {
    create: true,
    read: true,
    update: true,
    delete: true,
    enable: true,
  },
  Other: {
    read: false,
    enable: false,
  },
}

export type Document = {
  id: string
  cid: string
  hash256: string
  is_scanned: boolean
  number_of_clone: number
  group_id: string
  description: string
  user: UserType
  group: {
    id: string
    name: string
  }
  name: string
  mime_type: string
  status: string
  size: number
  updatedAt: string
  createdAt: string
  document_clone: Document_clone[]
  document_signer: Document_signer[]
}

export type Document_clone = {
  id: string
  cid: string
  hash256: string
  createdAt: string
  updatedAt: string
  status: string
  document_id: string
  document_signer: Document_signer[]
}

export type Document_signer = {}

export var PDF_SCALING_RATIO = {
  value: 1.4,
}


export const LOG_ACTION = {
  DOCUMENT: {
    SIGN_DOCUMENT: 'SIGN_DOCUMENT',
    CREATE_DOCUMENT: 'CREATE_DOCUMENT',
    DELETE_DOCUMENT: 'DELETE_DOCUMENT',
    SIGN_DOCUMENT_BY_WALLLET: 'SIGN_BY_WALLLET'
  },
  CERTIFICATE: {
    CREATE_CERTIFICATE: 'CREATE_CERTIFICATE',
    DELETE_CERTIFICATE: 'DELETE_CERTIFICATE',
    UPDATE_CERTIFICATE: 'UPDATE_CERTIFICATE',
    SIGN_CERTIFICATE: 'SIGN_CERTIFICATE',
    SIGN_CERTIFICATE_BY_WALLLET: 'SIGN_CERTIFICATE_BY_WALLLET'
  },
  WALLET: {
    UPDATE_SIGN_WALLET: 'UPDATE_WALLET',
    CONNECT_WALLET: 'CONNECT_WALLET',
  }
}