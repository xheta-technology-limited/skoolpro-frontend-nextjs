import { Entity } from "../api/common";
import { ColumnMapping as StaffColumnMapping } from "./staff";
import { ColumnMapping as StudentColumnMapping } from "./students";

export type ColumnMappingByEntity = {
  staff: StaffColumnMapping;
  students: StudentColumnMapping;
  guardian: Record<string, string>;
};

export type ColumnMappingFor<E extends Entity> = ColumnMappingByEntity[E];

export type AnyColumnMapping = ColumnMappingByEntity[keyof ColumnMappingByEntity];
