// assets/js/skills.js
// Tag-sphere implementation (the custom version we tested)
(function () {
  window.addEventListener('load', initTagSphere);

  function initTagSphere() {
    const canvas = document.getElementById('skillsCanvas');
    const ul = document.getElementById('skillsList');
    if (!canvas || !ul) return;

    const anchors = Array.from(ul.querySelectorAll('li a'));
    if (!anchors.length) return;

    const ctx = canvas.getContext('2d');
    let DPR = window.devicePixelRatio || 1;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let radius = Math.min(width, height) / 2 - 40;
    let tags = [];

    // rotation speed
    let vx = 0.002;
    let vy = 0.003;

    // interaction
    let dragging = false;
    let lastX = 0, lastY = 0;
    const sensitivity = 0.0008;

    function resizeCanvas() {
      DPR = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
      radius = Math.min(width, height) / 2 - 40;
      computeTagsPositions();
    }

    function computeTagsPositions() {
      const n = anchors.length;
      tags = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        tags.push({
          text: anchors[i].textContent.trim(),
          x: x * radius,
          y: y * radius,
          z: z * radius
        });
      }
    }

    function rotatePoint(p, ax, ay) {
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      let x = p.x * cosY + p.z * sinY;
      let z = -p.x * sinY + p.z * cosY;

      const cosX = Math.cos(ax), sinX = Math.sin(ax);
      let y = p.y * cosX - z * sinX;
      z = p.y * sinX + z * cosX;

      return { x, y, z };
    }

    function project(p3) {
      const focal = radius * 2.2;
      const scale = focal / (focal + p3.z);
      const sx = centerX + p3.x * scale;
      const sy = centerY + p3.y * scale;
      return { sx, sy, scale, z: p3.z };
    }

    let ax = 0, ay = 0;
    function render() {
      ctx.clearRect(0, 0, width, height);

      ax += vx;
      ay += vy;

      const projected = tags.map((t) => {
        const p3 = rotatePoint(t, ax, ay);
        const p2 = project(p3);
        p2.text = t.text;
        return p2;
      });

      projected.sort((a, b) => a.z - b.z);

      for (let p of projected) {
        const fontSize = Math.max(12, Math.round(18 * p.scale));
        ctx.font = `${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const alpha = Math.max(0.25, Math.min(1, 0.35 + p.scale * 1.1));
        ctx.fillStyle = `rgba(240,219,79,${alpha})`;
        ctx.fillText(p.text, p.sx, p.sy);
      }

      requestAnimationFrame(render);
    }

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointerup', function (e) {
      dragging = false;
      canvas.style.cursor = 'grab';
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      vy = dx * sensitivity;
      vx = dy * sensitivity;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    setInterval(() => {
      vx += (0.002 - vx) * 0.02;
      vy += (0.003 - vy) * 0.02;
    }, 60);

    window.addEventListener('resize', function () {
      clearTimeout(window._skillsResizeTimer);
      window._skillsResizeTimer = setTimeout(resizeCanvas, 120);
    });

    resizeCanvas();
    computeTagsPositions();
    render();
  }
})();
