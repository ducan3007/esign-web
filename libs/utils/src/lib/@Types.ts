export type UserType = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  group_id?: string;
  password?: string;
  user_role?: {
    name: string;
    id: number;
  };
  permission?: UserPermission[];
  is_active?: boolean;
  is_verified?: boolean;
  is_master_group?: boolean;
  wallet_address?: any[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserPermission = {
  role_id: number;
  feature: {
    name: string;
  };
  permission_id: number;
};

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
};
