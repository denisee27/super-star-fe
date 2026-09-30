export const INQUIRY_CATEGORY = Object.freeze({
  MCN_AGENCY: "MCN_AGENCY",
  PASUKAN_AFFILIATE: "PASUKAN_AFFILIATE",
  BRAND_SELLER: "BRAND_SELLER",
  EVENT: "EVENT",
});

export const TOP_LEVEL = Object.freeze({
  AFFILIATE: "AFFILIATE",
  EVENT: "EVENT",
  BRAND_SELLER: "BRAND_SELLER",
});

export const AFFILIATE_TYPE = Object.freeze({
  MCN: "MCN",
  PAS: "PAS",
});

export const MCN_PLATFORM = Object.freeze({
  TIKTOK_SHOP: "TIKTOK_SHOP",
  SHOPEE: "SHOPEE",
});

export const GMV_RANGE = Object.freeze({
  BELOW_10: "< 10 Juta",
  TEN_TO_30: "10-30 Juta",
  THIRTY_TO_100: "30-100 Juta",
  ABOVE_100: "> 100 Juta",
});

export const FOLLOWERS_RANGE = Object.freeze({
  BELOW_1K: "< 1.000",
  ONE_TO_10K: "1.000 - 10.000",
  TEN_TO_50K: "10.000 - 50.000",
  FIFTY_TO_100K: "50.000 - 100.000",
  ABOVE_100K: "> 100.000",
});

export const INQUIRY_STEP = Object.freeze({
  TOP_LEVEL: "top_level",
  AFFILIATE_TYPE: "affiliate_type",
  PLATFORM: "platform",
  EVENT_SELECT: "event_select",
  FORM: "form",
  SUCCESS: "success",
});
