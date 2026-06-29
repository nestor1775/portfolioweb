/**
 * Liquid Glass — basado en https://github.com/archisvaze/liquid-glass
 * Requiere Chrome/Chromium para el filtro SVG; otros navegadores usan blur de respaldo.
 */
(function (global) {
  const SURFACE_FNS = {
    convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
    convex_circle: (x) => Math.sqrt(1 - (1 - x) * (1 - x)),
    concave: (x) => 1 - Math.sqrt(1 - (1 - x) * (1 - x)),
    lip: (x) => {
      const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 0.25);
      const concave = 1 - Math.sqrt(1 - (1 - x) * (1 - x)) + 0.1;
      const t = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
      return convex * (1 - t) + concave * t;
    },
  };

  function calculateRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples = 128) {
    const eta = 1 / ior;

    function refract(nx, ny) {
      const dot = ny;
      const k = 1 - eta * eta * (1 - dot * dot);
      if (k < 0) return null;
      const sq = Math.sqrt(k);
      return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
    }

    const profile = new Float64Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = i / samples;
      const y = heightFn(x);
      const dx = x < 1 ? 0.0001 : -0.0001;
      const y2 = heightFn(x + dx);
      const deriv = (y2 - y) / dx;
      const mag = Math.sqrt(deriv * deriv + 1);
      const ref = refract(-deriv / mag, -1 / mag);
      if (!ref) {
        profile[i] = 0;
        continue;
      }
      profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
    }
    return profile;
  }

  function generateDisplacementMap(w, h, radius, bezelWidth, profile, maxDisp) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h);
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      d[i] = 128;
      d[i + 1] = 128;
      d[i + 2] = 0;
      d[i + 3] = 255;
    }

    const r = radius;
    const rSq = r * r;
    const r1Sq = (r + 1) ** 2;
    const rBSq = Math.max(r - bezelWidth, 0) ** 2;
    const wB = w - r * 2;
    const hB = h - r * 2;
    const S = profile.length;

    for (let y1 = 0; y1 < h; y1++) {
      for (let x1 = 0; x1 < w; x1++) {
        const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
        const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
        const dSq = x * x + y * y;
        if (dSq > r1Sq || dSq < rBSq) continue;

        const dist = Math.sqrt(dSq);
        const fromSide = r - dist;
        const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
        if (op <= 0 || dist === 0) continue;

        const cos = x / dist;
        const sin = y / dist;
        const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
        const disp = profile[bi] || 0;
        const dX = (-cos * disp) / maxDisp;
        const dY = (-sin * disp) / maxDisp;
        const idx = (y1 * w + x1) * 4;
        d[idx] = (128 + dX * 127 * op + 0.5) | 0;
        d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
      }
    }

    ctx.putImageData(img, 0, 0);
    return c.toDataURL();
  }

  function generateSpecularMap(w, h, radius, bezelWidth, angle = Math.PI / 3) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h);
    const d = img.data;
    d.fill(0);

    const r = radius;
    const rSq = r * r;
    const r1Sq = (r + 1) ** 2;
    const rBSq = Math.max(r - bezelWidth, 0) ** 2;
    const wB = w - r * 2;
    const hB = h - r * 2;
    const sv = [Math.cos(angle), Math.sin(angle)];

    for (let y1 = 0; y1 < h; y1++) {
      for (let x1 = 0; x1 < w; x1++) {
        const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
        const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
        const dSq = x * x + y * y;
        if (dSq > r1Sq || dSq < rBSq) continue;

        const dist = Math.sqrt(dSq);
        const fromSide = r - dist;
        const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
        if (op <= 0 || dist === 0) continue;

        const cos = x / dist;
        const sin = -y / dist;
        const dot = Math.abs(cos * sv[0] + sin * sv[1]);
        const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
        const coeff = dot * edge;
        const col = (255 * coeff) | 0;
        const alpha = (col * coeff * op) | 0;
        const idx = (y1 * w + x1) * 4;
        d[idx] = col;
        d[idx + 1] = col;
        d[idx + 2] = col;
        d[idx + 3] = alpha;
      }
    }

    ctx.putImageData(img, 0, 0);
    return c.toDataURL();
  }

  function supportsSvgBackdropFilter() {
    return (
      CSS.supports('(-webkit-backdrop-filter: url(#t))') ||
      CSS.supports('(backdrop-filter: url(#t))')
    );
  }

  function applyCssVars(el, options) {
    el.style.setProperty('--glass-radius', `${options.borderRadius}px`);
    el.style.setProperty('--shadow-color', options.shadowColor);
    el.style.setProperty('--shadow-blur', `${options.shadowBlur}px`);
    el.style.setProperty('--shadow-spread', `${options.shadowSpread}px`);
    el.style.setProperty('--tint-color', options.tintColor);
    el.style.setProperty('--tint-opacity', String(options.tintOpacity));
    el.style.setProperty('--outer-shadow-blur', `${options.outerShadowBlur}px`);
  }

  function init(element, userOptions = {}) {
    if (!element) return;

    const options = {
      surfaceFn: 'convex_squircle',
      glassThickness: 50,
      bezelWidth: 40,
      ior: 2.5,
      scaleRatio: 1.0,
      blurAmount: 0.3,
      specularOpacity: 0.5,
      specularSaturation: 4,
      borderRadius: 9999,
      tintColor: '255, 255, 255',
      tintOpacity: 0.06,
      shadowColor: 'rgba(255, 255, 255, 0.45)',
      shadowBlur: 20,
      shadowSpread: -5,
      outerShadowBlur: 24,
      filterId: 'liquid-glass-filter',
      svgDefsId: 'svg-defs',
      ...userOptions,
    };

    element.classList.add('liquid-glass');

    if (!supportsSvgBackdropFilter()) {
      element.classList.add('liquid-glass--fallback');
    }

    applyCssVars(element, options);

    let svgDefs = document.getElementById(options.svgDefsId);
    if (!svgDefs) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.cssText = 'position:absolute;overflow:hidden';
      svg.setAttribute('color-interpolation-filters', 'sRGB');
      svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgDefs.id = options.svgDefsId;
      svg.appendChild(svgDefs);
      document.body.appendChild(svg);
    }

    let timer;
    function rebuildFilter() {
      const w = element.offsetWidth;
      const h = element.offsetHeight;
      if (w < 2 || h < 2) return;

      const heightFn = SURFACE_FNS[options.surfaceFn];
      const clampedBezel = Math.min(
        options.bezelWidth,
        options.borderRadius - 1,
        Math.min(w, h) / 2 - 1
      );
      const effectiveRadius = Math.min(options.borderRadius, Math.min(w, h) / 2);

      const profile = calculateRefractionProfile(
        options.glassThickness,
        clampedBezel,
        heightFn,
        options.ior
      );
      const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
      const dispUrl = generateDisplacementMap(w, h, effectiveRadius, clampedBezel, profile, maxDisp);
      const specUrl = generateSpecularMap(w, h, effectiveRadius, clampedBezel * 2.5);
      const scale = maxDisp * options.scaleRatio;

      svgDefs.innerHTML = `
        <filter id="${options.filterId}" x="0%" y="0%" width="100%" height="100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${options.blurAmount}" result="blurred_source" />
          <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
          <feDisplacementMap in="blurred_source" in2="disp_map"
            scale="${scale}" xChannelSelector="R" yChannelSelector="G"
            result="displaced" />
          <feColorMatrix in="displaced" type="saturate" values="${options.specularSaturation}" result="displaced_sat" />
          <feImage href="${specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
          <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
          <feComponentTransfer in="spec_layer" result="spec_faded">
            <feFuncA type="linear" slope="${options.specularOpacity}" />
          </feComponentTransfer>
          <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
          <feBlend in="spec_faded" in2="with_sat" mode="normal" />
        </filter>
      `;
    }

    function scheduleRebuild() {
      clearTimeout(timer);
      timer = setTimeout(rebuildFilter, 30);
    }

    if (!supportsSvgBackdropFilter()) return;

    requestAnimationFrame(() => requestAnimationFrame(rebuildFilter));

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(scheduleRebuild);
      observer.observe(element);
    }

    window.addEventListener('resize', scheduleRebuild);
  }

  global.LiquidGlass = { init };
})(window);
