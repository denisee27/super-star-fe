import { useState } from "react";
import { INQUIRY_STEP, INQUIRY_CATEGORY, TOP_LEVEL, AFFILIATE_TYPE } from "../types/inquiry.types.js";

export function useCategoryFlow() {
  const [step, setStep] = useState(INQUIRY_STEP.TOP_LEVEL);
  const [topLevel, setTopLevel] = useState(null);
  const [affiliateType, setAffiliateType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  function selectTopLevel(value) {
    setTopLevel(value);
    if (value === TOP_LEVEL.AFFILIATE) {
      setStep(INQUIRY_STEP.AFFILIATE_TYPE);
    } else if (value === TOP_LEVEL.EVENT) {
      setStep(INQUIRY_STEP.EVENT_SELECT);
    } else {
      setSelectedCategory(INQUIRY_CATEGORY.BRAND_SELLER);
      setStep(INQUIRY_STEP.FORM);
    }
  }

  function selectAffiliateType(value) {
    setAffiliateType(value);
    if (value === AFFILIATE_TYPE.MCN) {
      setSelectedCategory(INQUIRY_CATEGORY.MCN_AGENCY);
      setStep(INQUIRY_STEP.PLATFORM);
    } else {
      setSelectedCategory(INQUIRY_CATEGORY.PASUKAN_AFFILIATE);
      setStep(INQUIRY_STEP.FORM);
    }
  }

  function selectPlatform(platform) {
    setSelectedPlatform(platform);
    setStep(INQUIRY_STEP.FORM);
  }

  function selectEvent(event) {
    setSelectedEvent(event);
    setSelectedCategory(INQUIRY_CATEGORY.EVENT);
    setStep(INQUIRY_STEP.FORM);
  }

  function goBack() {
    if (step === INQUIRY_STEP.FORM) {
      if (selectedCategory === INQUIRY_CATEGORY.MCN_AGENCY) {
        setStep(INQUIRY_STEP.PLATFORM);
      } else if (selectedCategory === INQUIRY_CATEGORY.EVENT) {
        setSelectedEvent(null);
        setStep(INQUIRY_STEP.EVENT_SELECT);
      } else if (selectedCategory === INQUIRY_CATEGORY.PASUKAN_AFFILIATE) {
        setStep(INQUIRY_STEP.AFFILIATE_TYPE);
      } else {
        setStep(INQUIRY_STEP.TOP_LEVEL);
        setSelectedCategory(null);
      }
    } else if (step === INQUIRY_STEP.PLATFORM) {
      setSelectedPlatform(null);
      setStep(INQUIRY_STEP.AFFILIATE_TYPE);
    } else if (step === INQUIRY_STEP.AFFILIATE_TYPE) {
      setAffiliateType(null);
      setSelectedCategory(null);
      setStep(INQUIRY_STEP.TOP_LEVEL);
    } else if (step === INQUIRY_STEP.EVENT_SELECT) {
      setStep(INQUIRY_STEP.TOP_LEVEL);
    }
  }

  function onSuccess(formData) {
    setLastFormData(formData ?? null);
    setStep(INQUIRY_STEP.SUCCESS);
  }

  function reset() {
    setStep(INQUIRY_STEP.TOP_LEVEL);
    setTopLevel(null);
    setAffiliateType(null);
    setSelectedCategory(null);
    setSelectedPlatform(null);
    setSelectedEvent(null);
    setLastFormData(null);
  }

  return {
    step,
    topLevel,
    affiliateType,
    selectedCategory,
    selectedPlatform,
    selectedEvent,
    lastFormData,
    selectTopLevel,
    selectAffiliateType,
    selectPlatform,
    selectEvent,
    goBack,
    onSuccess,
    reset,
  };
}
