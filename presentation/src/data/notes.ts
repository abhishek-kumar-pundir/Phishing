export interface SceneMetadata {
  index: number;
  id: string;
  title: string;
  category: string;
  theme: "dark" | "light";
  substepsCount: number;
  durationSeconds: number;
  script: string;
  vivaQuestion: string;
  vivaAnswer: string;
}

export const SCENES_DATA: SceneMetadata[] = [
  {
    index: 1,
    id: "scene-title",
    title: "Phish360 Defense Architecture",
    category: "01 · Project Defense",
    theme: "dark",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "Good morning, committee members. Today I am defending Phish360, a supervised multimodal defense architecture for phishing website detection. Traditional security relies on blacklists and lexical URL filters. Attackers easily bypass these with ephemeral domains and cloned visual templates. Phish360 addresses this by jointly evaluating four distinct attack representations—URL structure, DOM hierarchy, text semantics, and visual layout—fusing them into a calibrated decision meta-model.",
    vivaQuestion: "Why did you choose a multimodal approach instead of an end-to-end deep learning model?",
    vivaAnswer:
      "End-to-end models like multimodal transformers require massive joint training datasets and fail silently if one modality (like an image or HTML) cannot be fetched at inference time. Our late-fusion modular design allows independent fallback, zero-network evaluation for URL-only passes, and distinct interpretability mechanisms like TreeSHAP per channel.",
  },
  {
    index: 2,
    id: "scene-story",
    title: "The Anatomy of a Lure",
    category: "02 · Motivation",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "Consider a real attack trajectory. An employee receives an urgent notification claiming their enterprise account is locked. The link leads to an impeccably cloned login page. Visually, it matches the legitimate portal pixel-for-pixel. But beneath the surface, the form action points to an external drop server, and the domain was registered three hours ago. Blacklists are completely blind to this window.",
    vivaQuestion: "How long does it typically take for a phishing URL to appear on commercial blacklists?",
    vivaAnswer:
      "Industry telemetry shows commercial feeds like Google Safe Browsing and PhishTank take between 4 to 24 hours to index newly stood-up phishing sites. Attack campaigns typically achieve their credential-harvesting objectives within the first 2 to 3 hours, rendering reactive blacklists ineffective against initial victims.",
  },
  {
    index: 3,
    id: "scene-blacklist-failure",
    title: "The Temporal Failure of Blacklists",
    category: "03 · Threat Landscape",
    theme: "dark",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "Here is the empirical life timeline of a phishing campaign. The domain is registered at hour zero, spam distribution peaks between hours one and three, and the site is abandoned by hour six. Blacklist crawlers only discover, verify, and propagate the threat signature at hour nine. Supervised machine learning is the only viable mechanism to classify zero-day attacks synchronously at first request.",
    vivaQuestion: "Does proactive classification introduce higher false alarm risks compared to verified blacklists?",
    vivaAnswer:
      "Yes. Blacklists have virtually zero false positives because humans or consensus crawlers verify them. To achieve acceptable false positive rates for proactive ML, we designed dedicated high-precision operating points calibrated to achieve zero false positives across 1,499 clean evaluation websites.",
  },
  {
    index: 4,
    id: "scene-real-vs-fake",
    title: "Surface Deception vs. Structural Reality",
    category: "04 · Attack Vectors",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "When comparing an authentic enterprise portal to a cloned replica, visual inspection alone easily deceives humans. Both render identical logos, input fields, and color schemes. However, examining the document object model reveals that the fake site contains zero internal navigation links, hosts scripts from disparate third-party domains, and routes password submissions to an external IP.",
    vivaQuestion: "Can attackers defeat DOM inspection by copying the exact scripts of the authentic website?",
    vivaAnswer:
      "Even if scripts are copied, the form action destination must submit credentials to the attacker's server to harvest them, or use an API hook that violates legitimate cross-origin policies. Our DOM model captures form action origin disparities and external link ratios as top features.",
  },
  {
    index: 5,
    id: "scene-url-anatomy",
    title: "URL Anatomy & Information Theory",
    category: "05 · Feature Engineering",
    theme: "dark",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "Let us examine how Phish360 dissects a URL string without network access. Humans read left-to-right, often tricked by leading subdomains like 'account.security-update'. But DNS and web protocols resolve from the right. We compute Shannon entropy over domain characters, measure subdomain depth, detect raw IP hosts, and extract 16 structural metrics in under 2 milliseconds.",
    vivaQuestion: "Why is Shannon entropy significant for domain classification?",
    vivaAnswer:
      "Legitimate enterprise domains are optimized for human memory and brand recognition, yielding moderate entropy. Domain Generation Algorithms (DGAs) and automated campaign kits use pseudorandom character sequences that produce significantly higher Shannon entropy (often >3.8 bits per character), making it a strong discriminating feature.",
  },
  {
    index: 6,
    id: "scene-four-artifacts",
    title: "One Webpage, Four Independent Artifacts",
    category: "06 · Modality Decomposition",
    theme: "light",
    substepsCount: 4,
    durationSeconds: 40,
    script:
      "Phish360 breaks every target into four distinct analytical artifacts. First, the raw URL string evaluated lexically. Second, the serialized DOM tree evaluated for tag topology. Third, the visible text body evaluated through natural language processing. Fourth, the rendered viewport screenshot evaluated through convolutional computer vision. Each artifact captures an orthogonal attack surface.",
    vivaQuestion: "What happens if a website blocks automated crawlers or headless screenshot capture?",
    vivaAnswer:
      "Our architecture is designed with modular graceful degradation. If screenshot capture fails due to anti-bot measures, the ensemble automatically transitions to an ablation fallback weighting the remaining URL, DOM, and Text models, preserving 96.2% accuracy.",
  },
  {
    index: 7,
    id: "scene-why-one-signal-fails",
    title: "The Ceiling of Isolated Signals",
    category: "07 · Empirical Justification",
    theme: "dark",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "Why is a single model insufficient? Evaluating standalone performance on our test set of 2,760 samples reveals clear vulnerabilities. The URL model achieves only 80.8% accuracy. The Vision model achieves 85.4%. The Text model reaches 87.9%. Even the strong DOM model peaks at 94.4%. Only when late fusion combines their probabilistic evidence does accuracy climb to 96.3% and ROC-AUC reach 0.9949.",
    vivaQuestion: "Why does the URL model alone have an 88% recall but only 74% precision?",
    vivaAnswer:
      "URL lexical features suffer from false positives on complex legitimate URLs containing deep tracking paths, UUID query parameters, and CDNs, which mimic phishing structural complexity. The DOM and Text models provide the corrective evidence needed to eliminate those false alarms.",
  },
  {
    index: 8,
    id: "scene-dataset-splits",
    title: "Dataset Integrity & Leakage Prevention",
    category: "08 · Experimental Rigor",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "Methodological integrity is essential. We evaluated 10,700 crawled samples with exactly 2,760 held-out test sites and 1,191 validation sites. We enforced strict domain deduplication across splits to eliminate data leakage. No model training, hyperparameter tuning, or calibration had access to the test set prior to final evaluation.",
    vivaQuestion: "Were duplicate domain templates removed, or only exact URL strings?",
    vivaAnswer:
      "Exact duplicate URLs were stripped. However, as an honest limitation, repeated campaign kits hosted across distinct generated subdomains were not cluster-pruned. We discuss this domain-level clustering in our limitations scene as future work.",
  },
  {
    index: 9,
    id: "scene-url-features",
    title: "URL Features & Live Shannon Entropy",
    category: "09 · Lexical Modeling",
    theme: "dark",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "Here is the interactive entropy calculator running the exact mathematical formula implemented in our preprocessing pipeline: H equals negative sum of p_i log_2 p_i. Notice how common words maintain low entropy around 2.5, whereas automated algorithmic domains jump past 3.8. Our Random Forest evaluates 16 such signals simultaneously.",
    vivaQuestion: "Can attackers intentionally craft low-entropy phishing domains?",
    vivaAnswer:
      "Yes, using typosquatting like 'paypa1.test' or 'apple-security-support.test'. While their entropy remains low, our lexical pipeline catches them through keyword density, hyphen counts, and subdomain depth features.",
  },
  {
    index: 10,
    id: "scene-html-features",
    title: "DOM Structural Topography",
    category: "10 · Structural Modeling",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "The DOM model parses 24 structural heuristics. The most informative features identified by TreeSHAP are total link count, visible text length, external hyperlink ratio, and password input count. Legitimate portals feature rich navigation menus with hundreds of internal links; phishing kits typically have fewer than 10 links, mostly pointing nowhere.",
    vivaQuestion: "How do you handle client-side Single Page Applications (SPAs) where the initial HTML is nearly empty?",
    vivaAnswer:
      "Our headless Chrome capture runs JavaScript execution for up to 3 seconds until DOM idle, allowing SPAs built with React or Angular to fully render their DOM before feature extraction occurs.",
  },
  {
    index: 11,
    id: "scene-text-tfidf",
    title: "Text Semantics & TF-IDF Lures",
    category: "11 · Natural Language Processing",
    theme: "dark",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "Our natural language pipeline extracts body text and fits a linear model across unigram and bigram TF-IDF vectors with sublinear term frequency. Phishing attacks consistently rely on psychological pressure: urgency, account closure threats, and mandatory credential verification. The model assigns heavy positive weights to these specific bigrams.",
    vivaQuestion: "Why did you use linear TF-IDF instead of a fine-tuned transformer like BERT?",
    vivaAnswer:
      "Inference latency. A linear TF-IDF classifier evaluates in under 3 milliseconds on CPU with minimal memory footprint, whereas a BERT model requires hundreds of megabytes of VRAM and tens of milliseconds, making it impractical for real-time edge browser extensions.",
  },
  {
    index: 12,
    id: "scene-vision-resnet",
    title: "Visual Layout & ResNet-18 Embeddings",
    category: "12 · Computer Vision",
    theme: "light",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "For visual modeling, we pass the 224 by 224 normalized screenshot through a frozen pretrained ResNet-18 convolutional neural network. We pool the 512-dimensional feature representations from layer 4 and train a linear classifier on top. This captures overall spatial layout, login box positioning, and color blocking.",
    vivaQuestion: "Why did you freeze the ResNet-18 weights instead of fine-tuning end-to-end?",
    vivaAnswer:
      "Freezing the pretrained ImageNet backbone avoids catastrophic forgetting and overfitting on our 10,000-sample dataset while drastically reducing training compute. It also guarantees deterministic feature extraction across runtime environments.",
  },
  {
    index: 13,
    id: "scene-four-models-summary",
    title: "Model Ensemble Matrix",
    category: "13 · Model Architecture",
    theme: "dark",
    substepsCount: 4,
    durationSeconds: 40,
    script:
      "To summarize our four specialized models: URL uses a 100-tree Random Forest on 16 lexical signals. DOM uses a 100-tree Random Forest on 24 structural signals. Text uses a linear classifier on sparse TF-IDF vectors. Vision uses a linear head on 512-dimensional ResNet-18 embeddings. Each model outputs a calibrated probability between 0 and 1.",
    vivaQuestion: "Did you experiment with Gradient Boosted Trees (XGBoost) for the tabular models?",
    vivaAnswer:
      "Yes, XGBoost produced comparable accuracy (94.6% vs 94.4% on DOM) but Random Forest exhibited higher stability against out-of-distribution feature outliers and faster multi-threaded TreeSHAP computation.",
  },
  {
    index: 14,
    id: "scene-fusion-math",
    title: "Decision Fusion & Real Learned Weights",
    category: "14 · Late-Fusion Ensemble",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "Now we arrive at the core meta-classifier. We fit a calibrated Logistic Regression over the four posterior probabilities. The learned formula is shown live on screen. Text received the highest weight of plus 4.92, URL received plus 3.60, DOM received plus 2.63, and Vision received plus 1.20, with an intercept of negative 6.26. Try dragging the sliders below to see the exact decision boundary compute in real time.",
    vivaQuestion: "Why does Vision receive the lowest weight (+1.20) in the fusion model?",
    vivaAnswer:
      "Our empirical domain shift analysis revealed that when pages are rendered offline or headless without external CDN stylesheets, visual layout degrades, inflating false positives. The logistic regression optimizer correctly learned to discount vision in favor of the more reliable text and URL signals.",
  },
  {
    index: 15,
    id: "scene-confusion-metrics",
    title: "Confusion Matrix & Empirical Trade-offs",
    category: "15 · Performance Evaluation",
    theme: "dark",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "On the 2,760 test samples, the full fusion model achieves 1,183 true positives, 1,474 true negatives, with only 25 false positives and 78 false negatives. Think of it like a corporate mailroom: out of 1,500 clean packages, only 25 are mistakenly opened for inspection, while 94% of malicious mail is intercepted before delivery.",
    vivaQuestion: "What causes the 25 false positives in the test set?",
    vivaAnswer:
      "Qualitative error analysis shows that false positives concentrate on third-party SaaS portals, raw IP developer consoles, and enterprise password reset pages that exhibit low link counts and high form entropy resembling phishing kits.",
  },
  {
    index: 16,
    id: "scene-ablation-results",
    title: "Ablation Study: Quantifying Value",
    category: "16 · Scientific Verification",
    theme: "light",
    substepsCount: 4,
    durationSeconds: 40,
    script:
      "To verify that all four modalities contribute meaningfully, we performed an ablation experiment retraining the ensemble with each modality removed. Dropping the URL model causes test recall to collapse from 93.8% down to 90.5%. Dropping the DOM model drops recall to 91.8%. The full ensemble achieves the highest overall F1 score of 0.9583 and ROC-AUC of 0.9949.",
    vivaQuestion: "Does removing Vision significantly degrade the ensemble?",
    vivaAnswer:
      "Removing vision results in only a modest accuracy change (96.27% to 96.23%), confirming that while vision provides valuable corroboration on styled pages, the ensemble is robust even when vision cannot be captured.",
  },
  {
    index: 17,
    id: "scene-threshold-tuning",
    title: "Calibrated Operating Points",
    category: "17 · Deployment Strategy",
    theme: "dark",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "A static 0.50 threshold is inadequate for operational deployment. We established three distinct operating points: Balanced at 0.45 maximizing F1 score; High-Recall at 0.20 catching 97.9% of threats for high-risk perimeter filters; and High-Precision at 0.90 achieving zero false alarms across all 1,499 clean test sites for automated edge blocking.",
    vivaQuestion: "What is the cost of operating at the 0.90 High-Precision threshold?",
    vivaAnswer:
      "The recall drops from 93.8% to 70.7%, meaning approximately 29% of phishing attacks are not blocked automatically and must fall into an analyst review band or be caught by secondary defense layers.",
  },
  {
    index: 18,
    id: "scene-probability-calibration",
    title: "Probability Calibration & Reliability",
    category: "18 · Statistical Calibration",
    theme: "light",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "When a security system outputs an 80% risk score, an analyst must be able to trust that 8 out of 10 such sites are truly malicious. Our reliability curve closely follows the perfect diagonal, achieving a Brier score of 0.0288 and an Expected Calibration Error of only 4.0%, indicating exceptional probability reliability.",
    vivaQuestion: "How does uncalibrated output harm security operations?",
    vivaAnswer:
      "Uncalibrated models output overconfident scores near 0 or 1, distorting risk triage. A well-calibrated posterior probability allows risk-adjusted automated routing: high scores auto-block, medium scores enter analyst review, and low scores pass.",
  },
  {
    index: 19,
    id: "scene-explainability-shap",
    title: "Explainable AI (TreeSHAP)",
    category: "19 · Model Transparency",
    theme: "dark",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "Phish360 rejects black-box verdicts. For every scan, we compute local TreeSHAP explanations. This diverging bar visualization shows analysts the exact quantitative force each feature exerted toward phishing or toward legitimate classification. It explains the model's internal reasoning, not unverifiable ground truth.",
    vivaQuestion: "How do you compute Shapley values in real-time without slowing down user inference?",
    vivaAnswer:
      "We utilize TreeSHAP, an algorithm with polynomial time complexity O(TLD^2) relative to tree depth, which computes exact Shapley values across our 100-tree Random Forest in under 15 milliseconds, avoiding the exponential cost of kernel SHAP.",
  },
  {
    index: 20,
    id: "scene-domain-shift",
    title: "Domain Shift: Viewport vs. Offline Render",
    category: "20 · Empirical Stress Testing",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "We conducted a dedicated stress test evaluating domain shift between live extension viewport captures and offline headless renders across 600 samples. Standalone vision false positive rates exploded from 14.3% to 82.7% because offline HTML rendered without external CSS looked broken. But our multimodal fusion model maintained 96.3% accuracy, proving the resilience of late fusion.",
    vivaQuestion: "Why did vision fail so dramatically on offline renders?",
    vivaAnswer:
      "Offline renders lack remote stylesheets, resulting in default unstyled serif fonts and broken image placeholders that visually resemble unpolished phishing kits. The fusion meta-model compensates by prioritizing DOM and URL features.",
  },
  {
    index: 21,
    id: "scene-system-endpoints",
    title: "System Architecture & API Endpoints",
    category: "21 · Implementation",
    theme: "dark",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "The Phish360 ecosystem comprises three deployed components: a FastAPI microservice with Server-Sent Events streaming telemetry, our React and Three.js forensic cockpit, and a Manifest V3 browser extension for live tab auditing. The API provides predictable REST endpoints with full OpenAPI documentation.",
    vivaQuestion: "Why use Server-Sent Events (SSE) instead of a standard blocking POST request for live scans?",
    vivaAnswer:
      "SSE allows the frontend and extension to stream real-time progress indicators as each modality completes: URL in 2ms, DOM in 15ms, Text in 25ms, and Vision in 80ms. This prevents user timeout perception and visualizes the pipeline asynchronously.",
  },
  {
    index: 22,
    id: "scene-limitations",
    title: "Honest Limitations & Future Work",
    category: "22 · Critical Reflection",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "A credible scientific defense requires transparent limitations. First, our training dataset lacked longitudinal re-crawling, meaning temporal concept drift over multi-year horizons was not evaluated. Second, dynamic CAPTCHA gateways and multi-step OTP flows cannot be inspected headlessly. Future work will investigate active reinforcement learning and client-side web assembly inference.",
    vivaQuestion: "How would an attacker actively evade your multimodal model?",
    vivaAnswer:
      "An attacker could host phishing forms on trusted SaaS domains like Microsoft Forms to bypass URL lexical filters, while using clean styling and standard English text. To counter this, future work should incorporate brand logo visual matching and OCR verification.",
  },
  {
    index: 23,
    id: "scene-demo-plan",
    title: "Live Demonstration & Telemetry Protocol",
    category: "23 · Demonstration Plan",
    theme: "dark",
    substepsCount: 2,
    durationSeconds: 40,
    script:
      "For our live demonstration, we have pre-configured three test cases: an authentic university portal, an active credential-harvesting replica, and an ambiguous tracking URL falling into the review band. If live network access fluctuates during the defense, our offline cached scan archive provides instantaneous replay verification.",
    vivaQuestion: "How does the replay scrubber assist forensic incident responders?",
    vivaAnswer:
      "The replay scrubber stores serialized modality inputs and SHAP explanations in SQLite, allowing analysts to step backwards and forwards through an incident timeline to inspect what the victim browser rendered at the exact moment of exploitation.",
  },
  {
    index: 24,
    id: "scene-conclusion",
    title: "Key Contributions & Committee Q&A",
    category: "24 · Conclusion & Defense",
    theme: "light",
    substepsCount: 3,
    durationSeconds: 40,
    script:
      "In conclusion, Phish360 demonstrates that fusing URL, DOM, text, and visual signals elevates phishing classification to 96.3% accuracy and 0.9949 ROC-AUC. It proves that late fusion mitigates visual domain shift, and provides calibrated operating points and transparent TreeSHAP explanations. Thank you for your time. I welcome your questions.",
    vivaQuestion: "What is the single most important lesson from this research project?",
    vivaAnswer:
      "That no single feature modality is resilient against dedicated adversaries. High-performing security AI requires structural orthogonality across independent data channels combined with calibrated probability meta-ensembles.",
  },
];

