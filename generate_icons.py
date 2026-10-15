import os
import math
from PIL import Image, ImageDraw

def create_phish360_icon(size):
    # Create high-res canvas (4x supersampling for ultra smooth antialiased curves)
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = s / 2, s / 2
    r_outer = s * 0.46

    # 1. Dark squircle / rounded shield background with subtle deep gradient glow
    # Draw soft outer glow
    for glow_i in range(int(s * 0.04), 0, -2):
        alpha = int(25 * (1 - glow_i / (s * 0.04)))
        draw.ellipse(
            [cx - r_outer - glow_i, cy - r_outer - glow_i, cx + r_outer + glow_i, cy + r_outer + glow_i],
            fill=(91, 141, 239, alpha)
        )

    # Base dark container disc (cyber midnight #090D1A)
    draw.ellipse(
        [cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer],
        fill=(10, 15, 28, 255)
    )

    # 2. Outer Radar / 360 degree Sweep Ring (electric cyan to royal blue #38bdf8 to #5b8def)
    ring_thick = max(1.5 * scale, s * 0.065)
    ring_r = r_outer - ring_thick * 0.8
    bbox_ring = [cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r]

    # Draw arc representing 360 radar sweep with an opening
    draw.arc(bbox_ring, start=40, end=320, fill=(56, 189, 248, 240), width=int(ring_thick))
    # Accent dot on the radar sweep orbit
    dot_angle = math.radians(40)
    dot_x = cx + ring_r * math.cos(dot_angle)
    dot_y = cy + ring_r * math.sin(dot_angle)
    dot_r = ring_thick * 0.75
    draw.ellipse([dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r], fill=(129, 140, 248, 255))

    # 3. Inner Cyber Security Shield
    shield_w = s * 0.28
    shield_top = cy - s * 0.22
    shield_mid_y = cy + s * 0.02
    shield_tip_y = cy + s * 0.26

    # Shield vertices
    shield_pts = [
        (cx - shield_w, shield_top),
        (cx + shield_w, shield_top),
        (cx + shield_w, shield_mid_y),
        (cx, shield_tip_y),
        (cx - shield_w, shield_mid_y),
    ]

    # Shield fill gradient/solid
    draw.polygon(shield_pts, fill=(19, 28, 49, 255))
    
    # Shield border (Cyan-Blue glow)
    shield_border_w = max(1.5 * scale, s * 0.04)
    draw.line(shield_pts + [shield_pts[0]], fill=(91, 141, 239, 255), width=int(shield_border_w), joint="curve")

    # 4. Central Reticle / Radar Pulse Target inside Shield
    core_r = s * 0.08
    draw.ellipse([cx - core_r, cy - s * 0.04 - core_r, cx + core_r, cy - s * 0.04 + core_r], outline=(56, 189, 248, 220), width=max(1, int(scale * 1.2)))
    core_center_r = s * 0.035
    draw.ellipse([cx - core_center_r, cy - s * 0.04 - core_center_r, cx + core_center_r, cy - s * 0.04 + core_center_r], fill=(255, 255, 255, 255))

    # Crosshair ticks
    tick_len = s * 0.05
    cy_target = cy - s * 0.04
    tick_w = max(1, int(scale))
    draw.line([(cx - core_r - tick_len, cy_target), (cx - core_r + tick_len * 0.4, cy_target)], fill=(56, 189, 248, 220), width=tick_w)
    draw.line([(cx + core_r - tick_len * 0.4, cy_target), (cx + core_r + tick_len, cy_target)], fill=(56, 189, 248, 220), width=tick_w)
    draw.line([(cx, cy_target - core_r - tick_len), (cx, cy_target - core_r + tick_len * 0.4)], fill=(56, 189, 248, 220), width=tick_w)

    # Downscale with high quality Lanczos filter for razor-sharp antialiasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

def main():
    # Targets for extension
    ext_icon_dir = r"c:\Users\Abhishek Kuma\Desktop\Phishing\extension\icons"
    os.makedirs(ext_icon_dir, exist_ok=True)
    
    # Targets for frontend public
    frontend_pub_dir = r"c:\Users\Abhishek Kuma\Desktop\Phishing\frontend\public"
    os.makedirs(frontend_pub_dir, exist_ok=True)

    sizes = [16, 32, 48, 128, 512]
    
    # Generate extension icons
    for sz in sizes:
        icon = create_phish360_icon(sz)
        p = os.path.join(ext_icon_dir, f"icon-{sz}.png")
        icon.save(p, "PNG")
        print(f"Generated {p}")
        
    # Generate frontend icons
    icon_192 = create_phish360_icon(192)
    icon_192.save(os.path.join(frontend_pub_dir, "icon-192.png"), "PNG")
    
    icon_512 = create_phish360_icon(512)
    icon_512.save(os.path.join(frontend_pub_dir, "icon-512.png"), "PNG")
    
    icon_32 = create_phish360_icon(32)
    icon_32.save(os.path.join(frontend_pub_dir, "favicon-32x32.png"), "PNG")

    # Generate multi-size ICO for favicon
    ico_imgs = [create_phish360_icon(s) for s in [16, 32, 48]]
    ico_imgs[0].save(os.path.join(frontend_pub_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Generated favicon.ico")

    # Also save SVG favicon for crisp vector rendering in modern browsers
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0A0F1C"/>
    </radialGradient>
    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#5B8DEF"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Base Disc -->
  <circle cx="64" cy="64" r="58" fill="url(#bgGlow)" stroke="#1E293B" stroke-width="2"/>

  <!-- Radar / 360 Orbit Sweep -->
  <circle cx="64" cy="64" r="48" stroke="url(#orbitGrad)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="230 75" transform="rotate(-45 64 64)" filter="url(#glowFilter)"/>
  <circle cx="98" cy="30" r="3.5" fill="#38BDF8" filter="url(#glowFilter)"/>

  <!-- Inner Reticle Rings -->
  <circle cx="64" cy="64" r="36" stroke="#334155" stroke-width="1.5" stroke-dasharray="3 3"/>

  <!-- Shield -->
  <path d="M 64 36 L 86 44 C 86 66 76 82 64 92 C 52 82 42 66 42 44 Z" fill="url(#shieldGrad)" stroke="#5B8DEF" stroke-width="3" stroke-linejoin="round"/>

  <!-- Target Core -->
  <circle cx="64" cy="61" r="9" stroke="#38BDF8" stroke-width="2.2"/>
  <circle cx="64" cy="61" r="3.5" fill="#FFFFFF"/>
  <line x1="64" y1="46" x2="64" y2="52" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
  <line x1="64" y1="70" x2="64" y2="76" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
  <line x1="49" y1="61" x2="55" y2="61" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
  <line x1="73" y1="61" x2="79" y2="61" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
</svg>'''

    with open(os.path.join(frontend_pub_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(os.path.join(ext_icon_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated SVG favicons!")

if __name__ == "__main__":
    main()
