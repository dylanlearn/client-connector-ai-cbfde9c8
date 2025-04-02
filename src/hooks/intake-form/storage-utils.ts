
import { IntakeFormData } from "@/types/intake-form";
import { v4 as uuidv4 } from "uuid";

// The keys used for storing form data in localStorage
export const STORAGE_KEY_FORM_DATA = "intakeFormData";
export const STORAGE_KEY_FORM_STEP = "intakeFormStep";
export const STORAGE_KEY_FORM_ID = "intakeFormId";

/**
 * Loads form data from localStorage
 */
export const loadFormData = (): IntakeFormData => {
  const savedData = localStorage.getItem(STORAGE_KEY_FORM_DATA);
  const formId = localStorage.getItem(STORAGE_KEY_FORM_ID) || uuidv4();
  
  if (!savedData) {
    return { formId };
  }
  
  try {
    return JSON.parse(savedData);
  } catch (e) {
    console.error("Error parsing saved form data:", e);
    return { formId };
  }
};

/**
 * Saves form data to localStorage
 */
export const saveFormData = (data: IntakeFormData): void => {
  localStorage.setItem(STORAGE_KEY_FORM_DATA, JSON.stringify(data));
};

/**
 * Saves the current step to localStorage
 */
export const saveStep = (step: number): void => {
  localStorage.setItem(STORAGE_KEY_FORM_STEP, step.toString());
};

/**
 * Gets the current step from localStorage
 */
export const getSavedStep = (): number => {
  const savedStep = localStorage.getItem(STORAGE_KEY_FORM_STEP);
  return savedStep ? parseInt(savedStep) : 1;
};

/**
 * Clears all form data from localStorage
 */
export const clearFormStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY_FORM_DATA);
  localStorage.removeItem(STORAGE_KEY_FORM_STEP);
  localStorage.removeItem(STORAGE_KEY_FORM_ID);
};

/**
 * Gets the form ID from localStorage
 */
export const getFormId = (): string => {
  const savedFormId = localStorage.getItem(STORAGE_KEY_FORM_ID);
  const formId = savedFormId || uuidv4();
  
  if (!savedFormId) {
    localStorage.setItem(STORAGE_KEY_FORM_ID, formId);
  }
  
  return formId;
};

/**
 * Checks if there's a form in progress with a saved step
 */
export const hasInProgressForm = (formData: IntakeFormData): boolean => {
  return Object.keys(formData).length > 1 && localStorage.getItem(STORAGE_KEY_FORM_STEP) !== null;
};
