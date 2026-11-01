import json
import sys
import time
from pathlib import Path

sys.path.insert(0, ".")

print("--- 1. Testing Domain Shift Artifacts ---")
metrics_file = Path("artifacts/metrics/domain_shift.json")
assert metrics_file.exists(), "domain_shift.json does not exist"
with metrics_file.open("r", encoding="utf-8") as f:
    ds = json.load(f)

print(f"Sample size: {ds['sample_size']} ({ds['sample_breakdown']})")
print(f"Viewport: {ds['viewport']}")
print(f"Standalone vision accuracy: orig={ds['vision_standalone']['original_dataset_screenshots']['accuracy']}, vp={ds['vision_standalone']['viewport_offline_screenshots']['accuracy']} (delta: {ds['vision_standalone']['delta']['accuracy_delta']})")
print(f"Standalone vision FPR: orig={ds['vision_standalone']['original_dataset_screenshots']['fpr']}, vp={ds['vision_standalone']['viewport_offline_screenshots']['fpr']} (delta: {ds['vision_standalone']['delta']['fpr_delta']})")
print(f"Full fusion accuracy: orig={ds['fusion_model']['original_fusion_full']['accuracy']}, vp={ds['fusion_model']['viewport_fusion_full']['accuracy']}")
print(f"Minus-vision fusion accuracy: {ds['fusion_model']['fusion_minus_vision_fallback']['accuracy']}")
print(f"Fusion flip rate (default threshold 0.5): {ds['fusion_model']['flips_by_threshold']['default_0.50']['flip_rate']} ({ds['fusion_model']['flips_by_threshold']['default_0.50']['total_flips']} flips / {ds['fusion_model']['flips_by_threshold']['default_0.50']['total_samples']})")
print(f"Proposed mitigations: {len(ds['proposed_mitigations'])}")
for m in ds['proposed_mitigations']:
    print(f"  - [{m['id']}] {m['title']}")

print("\n--- 2. Testing GET /model-info Integration ---")
from api.app import model_info

coro = model_info()
try:
    coro.send(None)
except StopIteration as e:
    mi = e.value

assert "domain_shift" in mi, "domain_shift missing in /model-info"
assert mi["domain_shift"] is not None
print("GET /model-info successfully returns domain_shift!")

print("\n--- 3. Testing Real Capture Collection Catalog ---")
catalog_file = Path("artifacts/real_extension_captures/captures_catalog.json")
assert catalog_file.exists(), "captures_catalog.json missing"
with catalog_file.open("r", encoding="utf-8") as f:
    cat = json.load(f)
print(f"Registered safe captures count: {len(cat)}")
for c in cat[:3]:
    print(f"  {c['url']}: vision_score={c['vision_score']}, label={c['label']}")

print("\n=======================================================")
print(">>> ALL PHASE A3 VERIFICATION TESTS PASSED 100%! <<<")
print("=======================================================")
