export type Restriction = {
  id: string;
  denyable_type: string;
  denyable_id: string;
  permission: string;
  reason: string;
  created_by: { id: string; name: string };
  created_at: string;
};
