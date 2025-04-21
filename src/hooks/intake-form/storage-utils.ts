
// Create storage utilities
export const STORAGE_KEY = "intake_form_data";
export const STEP_KEY = "intake_form_step";

export const saveFormData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      lastUpdated: new Date().toISOString(),
    }));
    return true;
  } catch (error) {
    console.error("Error saving form data:", error);
    return false;
  }
};

export const getFormData = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error("Error getting form data:", error);
    return {};
  }
};

export const clearFormStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  } catch (error) {
    console.error("Error clearing form data:", error);
  }
};

export const saveStep = (step: number) => {
  try {
    localStorage.setItem(STEP_KEY, step.toString());
  } catch (error) {
    console.error("Error saving step:", error);
  }
};

export const getSavedStep = (): number => {
  try {
    const step = localStorage.getItem(STEP_KEY);
    return step ? parseInt(step, 10) : 0;
  } catch (error) {
    console.error("Error getting saved step:", error);
    return 0;
  }
};

export const hasInProgressForm = (): boolean => {
  try {
    const formData = getFormData();
    return Object.keys(formData).length > 0;
  } catch {
    return false;
  }
};
