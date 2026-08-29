export {
  academicYearSchema,
  type AcademicYearFormData,
} from "./schemas/create-academic-year-schema";

export {
  educationStructureSchema,
  type EducationStructureFormData,
} from "./schemas/create-education-structure-schema";

export { type AcademicYear } from "./types/api/academic-year";
export {
  type EducationPreset,
  type EducationPresetStage,
  type EducationPresetLevel,
} from "./types/api/presets";
export {
  type ApplyEducationPresetResponse,
  type ApplyEducationPresetLevel,
} from "./types/api/presets";

export {
  type EducationLevel,
  type EducationLevelStage,
} from "./types/api/levels";

export { type EducationArm, type EducationArmLevel } from "./types/api/arms";
