export type Permission = {
  key: string;
  action: string;
  label: string;
};

export type PermissionResource = {
  key: string;
  label: string;
  permissions: Permission[];
};

export type PermissionModule = {
  key: string;
  label: string;
  resources: PermissionResource[];
};

export type PermissionsResponse = {
  actions: string[];
  total: number;
  modules: PermissionModule[];
};
