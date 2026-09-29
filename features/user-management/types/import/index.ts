import { Entity } from "../api/common";
import { ColumnMapping as StaffColumnMapping } from "./staff";

export type ColumnMappingByEntity = {
  staff: StaffColumnMapping;
  students: Record<string, string>;
  guardian: Record<string, string>;
};

export type ColumnMappingFor<E extends Entity> = ColumnMappingByEntity[E];

export type AnyColumnMapping = ColumnMappingByEntity[keyof ColumnMappingByEntity];
