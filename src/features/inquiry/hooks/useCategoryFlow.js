import { useState } from "react";
import { INQUIRY_STEP, INQUIRY_CATEGORY } from "../types/inquiry.types.js";

export function useCategoryFlow() {
  const [step, setStep] = useState(INQUIRY_STEP.CATEGORY);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  function selectCategory(category) {
    setSelectedCategory(category);
    if (category === INQUIRY_CATEGORY.MCN_AGENCY) {
      setStep(INQUIRY_STEP.PLATFORM);
    } else {
      setStep(INQUIRY_STEP.FORM);
    }
  }

  function selectPlatform(platform) {
    setSelectedPlatform(platform);
    setStep(INQUIRY_STEP.FORM);
  }

  function goBack() {
    if (step === INQUIRY_STEP.FORM && selectedCategory === INQUIRY_CATEGORY.MCN_AGENCY) {
      setStep(INQUIRY_STEP.PLATFORM);
    } else if (step === INQUIRY_STEP.FORM) {
      setStep(INQUIRY_STEP.CATEGORY);
      setSelectedCategory(null);
    } else if (step === INQUIRY_STEP.PLATFORM) {
      setStep(INQUIRY_STEP.CATEGORY);
      setSelectedCategory(null);
      setSelectedPlatform(null);
    }
  }

  function onSuccess(formData) {
    setLastFormData(formData ?? null);
    setStep(INQUIRY_STEP.SUCCESS);
  }

  function reset() {
    setStep(INQUIRY_STEP.CATEGORY);
    setSelectedCategory(null);
    setSelectedPlatform(null);
    setLastFormData(null);
  }

  return { step, selectedCategory, selectedPlatform, lastFormData, selectCategory, selectPlatform, goBack, onSuccess, reset };
}
