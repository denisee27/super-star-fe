import { useState, useEffect } from "react";
import { getPixelConfig } from "../../settings/services/settingService.js";
import { INQUIRY_STEP, INQUIRY_CATEGORY, MCN_PLATFORM } from "../types/inquiry.types.js";

function injectCode(htmlCode) {
  if (!htmlCode?.trim()) return [];
  const div = document.createElement("div");
  div.innerHTML = htmlCode;
  const injected = [];
  div.querySelectorAll("script").forEach((old) => {
    const s = document.createElement("script");
    [...old.attributes].forEach((a) => s.setAttribute(a.name, a.value));
    s.textContent = old.textContent;
    document.head.appendChild(s);
    injected.push(s);
  });
  return injected;
}

export function useMetaPixel({ step, selectedCategory, selectedPlatform }) {
  const [pixelConfig, setPixelConfig] = useState(null);

  useEffect(() => {
    getPixelConfig()
      .then(setPixelConfig)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!pixelConfig || step !== INQUIRY_STEP.FORM) return;

    let code = null;
    if (selectedCategory === INQUIRY_CATEGORY.BRAND_SELLER) {
      code = pixelConfig.pixelBrandSeller;
    } else if (selectedCategory === INQUIRY_CATEGORY.MCN_AGENCY) {
      if (selectedPlatform === MCN_PLATFORM.TIKTOK_SHOP) {
        code = pixelConfig.pixelTiktokMcn;
      } else if (selectedPlatform === MCN_PLATFORM.SHOPEE) {
        code = pixelConfig.pixelShopeeMcn;
      }
    }

    if (!code?.trim()) return;

    const injected = injectCode(code);
    return () => {
      injected.forEach((s) => s.parentNode?.removeChild(s));
    };
  }, [pixelConfig, step, selectedCategory, selectedPlatform]);
}
