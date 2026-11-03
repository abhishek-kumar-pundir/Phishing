/**
 * Phish360 Defense Presentation - Ground-Truth Metric Store
 * Source: artifacts/metrics/*.json, artifacts/metrics/ablation_summary.csv, models/fusion_full_model.joblib
 * Strictly factual: no invented statistics or quotes.
 */

export interface ModalityMetric {
  name: string;
  code: "url" | "html" | "text" | "vision";
  algorithm: string;
  testAccuracy: number;
  testPrecision: number;
  testRecall: number;
  testF1: number;
  testRocAuc: number;
  weight: number;
  weightShare: number;
}

export const MODALITY_METRICS: Record<"url" | "html" | "text" | "vision", ModalityMetric> = {
  url: {
    name: "URL Lexical",
    code: "url",
    algorithm: "Random Forest (100 Trees)",
    testAccuracy: 0.8076,
    testPrecision: 0.7446,
    testRecall: 0.8810,
    testF1: 0.8071,
    testRocAuc: 0.9053,
    weight: 3.5985,
    weightShare: 0.2914,
  },
  html: {
    name: "DOM Structural",
    code: "html",
    algorithm: "Random Forest (100 Trees)",
    testAccuracy: 0.9442,
    testPrecision: 0.9601,
    testRecall: 0.9159,
    testF1: 0.9375,
    testRocAuc: 0.9854,
    weight: 2.6307,
    weightShare: 0.2130,
  },
  text: {
    name: "Text Semantic",
    code: "text",
    algorithm: "Linear TF-IDF SGD",
    testAccuracy: 0.8790,
    testPrecision: 0.9687,
    testRecall: 0.7597,
    testF1: 0.8516,
    testRocAuc: 0.9705,
    weight: 4.9169,
    weightShare: 0.3982,
  },
  vision: {
    name: "Vision Layout",
    code: "vision",
    algorithm: "ResNet-18 (512-d) + Linear Head",
    testAccuracy: 0.8543,
    testPrecision: 0.8439,
    testRecall: 0.8358,
    testF1: 0.8398,
    testRocAuc: 0.9304,
    weight: 1.2024,
    weightShare: 0.0974,
  },
};

export const FUSION_MODEL = {
  name: "Multimodal Late-Fusion",
  algorithm: "Calibrated Logistic Regression Meta-Estimator",
  intercept: -6.2590,
  weights: {
    url: 3.5985,
    html: 2.6307,
    text: 4.9169,
    vision: 1.2024,
  },
  testAccuracy: 0.9627,
  testPrecision: 0.9793,
  testRecall: 0.9381,
  testF1: 0.9583,
  testRocAuc: 0.9949,
  testSamples: 2760,
  testPhishing: 1261,
  testLegitimate: 1499,
  validationSamples: 1191,
};

export const OPERATING_POINTS = {
  balanced: {
    name: "Balanced Production",
    threshold: 0.45,
    reviewBand: [0.35, 0.55],
    testAccuracy: 0.9652,
    testPrecision: 0.9771,
    testRecall: 0.9461,
    testFpr: 0.0187,
    testF1: 0.9613,
    tp: 1193,
    fp: 28,
    tn: 1471,
    fn: 68,
    justification: "Selected on validation set to maximize empirical F1 score.",
  },
  highRecall: {
    name: "High Recall (Perimeter Gate)",
    threshold: 0.20,
    reviewBand: [0.15, 0.30],
    testAccuracy: 0.9656,
    testPrecision: 0.9478,
    testRecall: 0.9786,
    testFpr: 0.0454,
    testF1: 0.9629,
    tp: 1234,
    fp: 68,
    tn: 1431,
    fn: 27,
    justification: "Tuned for zero tolerance of missed credential-harvesting threats.",
  },
  highPrecision: {
    name: "High Precision (Edge Auto-Block)",
    threshold: 0.90,
    reviewBand: [0.70, 0.90],
    testAccuracy: 0.8663,
    testPrecision: 1.0000,
    testRecall: 0.7074,
    testFpr: 0.0000,
    testF1: 0.8286,
    tp: 892,
    fp: 0,
    tn: 1499,
    fn: 369,
    justification: "Zero false-positive threshold for automated blocking without analyst review.",
  },
  default: {
    name: "Standard 0.50 Threshold",
    threshold: 0.50,
    reviewBand: null,
    testAccuracy: 0.9627,
    testPrecision: 0.9793,
    testRecall: 0.9381,
    testFpr: 0.0167,
    testF1: 0.9583,
    tp: 1183,
    fp: 25,
    tn: 1474,
    fn: 78,
    justification: "Standard uncalibrated midpoint threshold.",
  },
};

export const CALIBRATION_DATA = {
  brierScore: 0.02878,
  expectedCalibrationError: 0.0400,
};

export const DOMAIN_SHIFT_DATA = {
  sampleSize: 600,
  standaloneVisionAccuracyDrop: 0.2634,
  standaloneVisionFprIncrease: 0.6834,
  fusionAccuracyDrop: -0.0016,
  fusionFlipRateAtDefault: 0.0017,
};

/**
 * Calculates raw logit z and posterior phishing probability
 */
export function computeFusionProbability(pUrl: number, pHtml: number, pText: number, pVision: number) {
  const z =
    FUSION_MODEL.intercept +
    FUSION_MODEL.weights.url * pUrl +
    FUSION_MODEL.weights.html * pHtml +
    FUSION_MODEL.weights.text * pText +
    FUSION_MODEL.weights.vision * pVision;
  const probability = 1 / (1 + Math.exp(-z));
  return { z, probability };
}
