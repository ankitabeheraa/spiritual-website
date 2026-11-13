(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IMG = {
  "waves": "/rainbow-waves-over-hillside.jpg",
  "arc0": "/healing-moment-1.jpg",
  "arc1": "/healing-moment-2.jpg",
  "arc2": "/healing-moment-3.jpg",
  "arc3": "/healing-moment-4.jpg",
  "arc4": "/healing-moment-5.jpg",
  "arc5": "/healing-moment-6.jpg",
  "arc6": "/healing-moment-7.jpg",
  "arc7": "/healing-moment-8.jpg",
  "t_reiki1": "/reiki1.jpg",
  "t_orb": "/orb.jpg",
  "t_lake": "/lake.jpg",
  "t_sea": "/sea.jpg",
  "t_hands": "/hands.jpg",
  "t_waves": "/waves.jpg",
  "t_sit": "/sit.jpg",
  "t_bloom": "/bloom.jpg",
  "t_daisy": "/daisy.jpg",
  "t_write": "/write.jpg",
  "t_grad": "/grad.jpg",
  "t_g2": "/g2.jpg",
  "t_woman": "/woman.jpg",
  "t_fig": "/fig.jpg",
  "t_g3": "/g3.jpg",
  "t_hero": "/hero.jpg",
  "t_reiki2": "/reiki2.jpg",
  "t_g1": "/g1.jpg",
  "t_grass": "/grass.jpg",
  "t_avatar": "/avatar.jpg"
};

  root.classList.add('js');

  /* ----- split headings into masked words ----- */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var idx = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            var i = document.createElement('span'); i.className = 'wi'; i.textContent = p; i.style.setProperty('--i', idx++);
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(el);
  });

  /* ----- scroll reveal ----- */
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  }
  function arm(scope) {
    scope.querySelectorAll('[data-split], .imgr, .fade').forEach(function (el) {
      el.classList.remove('in');
      if (io && !reduce) io.observe(el); else el.classList.add('in');
    });
  }

  /* ----- page setup: every page is its own URL, so just arm the reveals ----- */
  var foot = document.getElementById('site-footer');
  arm(document.querySelector('main')); arm(foot);
  document.addEventListener('click', function (e) { var u = e.target.closest ? e.target.closest('[data-top]') : null; if (u) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } });

  /* ----- Get in touch form (Formspree) ----- */
  var ENDPOINT = 'https://formspree.io/f/xoeeekdz';
  function wireForm(form, note, onOk) {
    function say(msg, kind) { note.textContent = msg; note.className = 'form-note' + (kind ? ' ' + kind : ''); }
    form.addEventListener('reset', function () { say(''); });
    var fields = [
      { n: 'name', check: function (v) { v = v.trim(); if (!v) return 'Please enter your name.'; if (v.length < 2) return 'Please enter your full name.'; if (!/[A-Za-z\u00C0-\u024F\u0900-\u097F]/.test(v)) return 'Please use letters in your name.'; return ''; } },
      { n: 'email', check: function (v) { v = v.trim(); if (!v) return 'Please enter your email.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Please enter a valid email, like name@example.com.'; return ''; } },
      { n: 'phone_number', check: function (v) {
          var d = v.replace(/[\s\-()]/g, ''); if (!d) return 'Please enter your phone number.';
          if (!/^\d+$/.test(d)) return 'Please use digits only for your phone number.';
          var cc = form.elements.country_code.value;
          if (cc === '+91' && !/^[6-9]\d{9}$/.test(d)) return 'Please enter a valid 10-digit Indian mobile number.';
          if (d.length < 6 || d.length > 14) return 'Please enter a valid phone number (6 to 14 digits).';
          return ''; } }
    ];
    var cbtn = form.querySelector('.msel-btn');
    if (cbtn) fields.push({ n: 'course', el: cbtn, get: function () { return form.querySelectorAll('input[name="course"]:checked').length ? 'ok' : ''; }, check: function (v) { return v ? '' : 'Please choose at least one course.'; } });
    fields.forEach(function (f, i) {
      var el = f.el || form.elements[f.n], box = el.closest('.f2'), err = document.createElement('span');
      err.className = 'f-err'; err.id = form.id + '-err-' + i; err.setAttribute('role', 'alert'); box.appendChild(err);
      f.el = el; f.err = err;
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true' && !f.check(val(f))) clear(f); });
      if (f.get) form.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true' && !f.check(val(f))) clear(f); });
      if (!f.get) el.addEventListener('blur', function () { if (el.value) show(f); });
    });
    function val(f) { return f.get ? f.get() : f.el.value; }
    form.elements.country_code.addEventListener('change', function () { var f = fields[2]; if (f.el.value) show(f); });
    function clear(f) { f.err.textContent = ''; f.el.removeAttribute('aria-invalid'); f.el.removeAttribute('aria-describedby'); }
    function show(f) { var m = f.check(val(f)); if (m) { f.err.textContent = m; f.el.setAttribute('aria-invalid', 'true'); f.el.setAttribute('aria-describedby', f.err.id); } else clear(f); return m; }
    form.addEventListener('reset', function () { fields.forEach(clear); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null; fields.forEach(function (f) { if (show(f) && !bad) bad = f; });
      if (bad) { say('Please fix the highlighted fields.', 'err'); bad.el.focus(); return; }
      var btn = form.querySelector('button[type="submit"]');
      var fd = new FormData(form);
      fd.set('phone', (fd.get('country_code') + ' ' + fd.get('phone_number')).replace(/\s+/g, ' ').trim());
      fd.delete('country_code'); fd.delete('phone_number');
      var cs = fd.getAll('course'); fd.delete('course'); if (cs.length) fd.set('courses', cs.join(', '));
      btn.disabled = true; say('Sending...');
      fetch(ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (d) {
            if (r.ok) { form.reset(); say('Thank you. Your details were sent and I will be in touch soon.', 'ok'); if (onOk) onOk(); }
            else { say((d && d.errors && d.errors.map(function (x) { return x.message; }).join(' ')) || 'Something went wrong. Please check your details and try again.', 'err'); }
          });
        })
        .catch(function () { say('The form could not reach the server. Please try again, or email contact@bloomwithin.world.', 'err'); })
        .then(function () { btn.disabled = false; });
    });
    return say;
  }

  (function () {
    var list = document.getElementById('faq-list');
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('.faq-item'));
    function setOpen(item, open) {
      var b = item.querySelector('.faq-q');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      item.classList.toggle('open', open);
    }
    /* Reserve room for the tallest answer so opening one never pushes the footer down. */
    function reserve() {
      var h = 0, maxA = 0;
      items.forEach(function (it) {
        h += it.querySelector('.faq-q').offsetHeight + 2;
        var a = it.querySelector('.faq-a > div');
        if (a.scrollHeight > maxA) maxA = a.scrollHeight;
      });
      h += 8 * (items.length - 1) + maxA;
      list.style.minHeight = Math.ceil(h) + 'px';
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.faq-q') : null;
      if (!b) return;
      var item = b.parentNode.parentNode, open = b.getAttribute('aria-expanded') !== 'true';
      items.forEach(function (it) { setOpen(it, it === item && open); });
    });
    reserve();
    window.addEventListener('resize', reserve);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve);
    window.addEventListener('load', reserve);
  })();
  if (document.getElementById('contact-form')) wireForm(document.getElementById('contact-form'), document.getElementById('cf-status'));

  /* ----- Book now popup ----- */
  var modal = document.getElementById('book-modal');
  var bform = document.getElementById('book-form');
  var bnote = document.getElementById('bk-status');
  var lastBtn = null, closeT = null;
  var bsay = wireForm(bform, bnote, function () { closeT = setTimeout(closeModal, 1800); });
  var clist = document.getElementById('bk-c-list'), cbtn2 = document.getElementById('bk-c-btn'), cval = document.getElementById('bk-c-val');
  function chosen() { return Array.prototype.map.call(bform.querySelectorAll('input[name="course"]:checked'), function (c) { return c.value; }); }
  function paintCourses() {
    var c = chosen(); cval.textContent = c.length ? c.join(', ') : 'Select one or more courses'; cval.classList.toggle('ph', !c.length);
    document.getElementById('bk-sub').textContent = c.length ? 'Booking: ' + c.join(', ') : 'Please leave your details and I will be in touch.';
  }
  function setCourses(list) {
    Array.prototype.forEach.call(bform.querySelectorAll('input[name="course"]'), function (c) { c.checked = list.indexOf(c.value) > -1; });
    toggleList(false); paintCourses();
  }
  function toggleList(open) { clist.hidden = !open; cbtn2.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  cbtn2.addEventListener('click', function () { toggleList(clist.hidden); });
  bform.addEventListener('change', function (e) { if (e.target.name === 'course') paintCourses(); });
  bform.addEventListener('reset', function () { setTimeout(function () { toggleList(false); paintCourses(); }, 0); });
  paintCourses();
  function openModal(course, btn) {
    clearTimeout(closeT); lastBtn = btn || null;
    setCourses(course ? [course] : []);
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); root.classList.add('js-lock');
    setTimeout(function () { var f = document.getElementById('bk-name'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function closeModal() {
    clearTimeout(closeT);
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); root.classList.remove('js-lock');
    if (lastBtn) { try { lastBtn.focus({ preventScroll: true }); } catch (e) {} }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-book]') : null;
    if (b) { e.preventDefault(); openModal(b.getAttribute('data-book'), b); return; }
    if (e.target.closest && e.target.closest('[data-close]')) { closeModal(); return; }
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) { if (!clist.hidden) { toggleList(false); cbtn2.focus(); } else closeModal(); }
    if (e.key === 'Tab' && modal.classList.contains('open')) {
      var f = modal.querySelectorAll('button, input, select, a[href]'); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ----- Arc gallery: cards ride a circle and drift slowly ----- */
  (function () {
    var host = document.getElementById('arc');
    if (!host) return;
    var stage = host.querySelector('.arc-stage'), N = 24, STEP = 360 / N, cards = [];
    var alts = ['An artist resting on a stool in a paint-splashed studio', 'A woman with closed eyes, face lifted to the sun', 'A student working on a laptop in a sunlit library', 'People crossing a street in golden evening light', 'A smiling woman in a yellow coat against the sky', 'A woman waiting at a bus stop in warm light', 'A runner seen from above on a red track', 'A woman resting her chin on her hand among prints and books'];
    for (var i = 0; i < N; i++) {
      var f = document.createElement('figure'); f.className = 'arc-card';
      var im = document.createElement('img'); im.src = IMG['arc' + (i % 8)] || ''; im.alt = alts[i % 8]; im.decoding = 'async';
      f.appendChild(im); stage.appendChild(f); cards.push(f);
    }
    var W = 0, aw = 0, base = 0, vis = false, last = 0, drift = 0;
    function layout() {
      W = host.clientWidth; aw = Math.max(W, 820);
      host.style.setProperty('--aw', aw + 'px');
      var cp = host.querySelector('.arc-copy'); host.style.height = Math.round(aw * 0.485 + cp.offsetHeight + 56) + 'px';
      draw();
    }
    function draw() {
      var R = aw * 0.62, cw = aw * 0.125, ch = cw * 1.58, cy = aw * 0.2 + R + ch / 2;
      for (var i = 0; i < N; i++) {
        var th = ((i * STEP + drift) % 360 + 540) % 360 - 180;
        var c = cards[i];
        if (Math.abs(th) > 75) { c.style.visibility = 'hidden'; continue; }
        c.style.visibility = 'visible'; c.style.width = cw + 'px'; c.style.height = ch + 'px';
        var rad = th * Math.PI / 180, x = W / 2 + R * Math.sin(rad) - cw / 2, y = cy - R * Math.cos(rad) - ch / 2;
        c.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + th.toFixed(2) + 'deg)';
      }
    }
    function tick(now) {
      if (!vis) { last = 0; return; }
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      drift = (drift + 3.2 * dt) % 360; draw(); requestAnimationFrame(tick);
    }
    layout(); window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !vis) { vis = true; requestAnimationFrame(tick); } else if (!v) vis = false; }, { rootMargin: '80px' }).observe(host);
    document.addEventListener('click', function () { setTimeout(layout, 60); });
  })();

  /* ----- Healing inspiration rows (all move right) ----- */
  (function () {
    var rows = document.querySelectorAll('.insp-row');
    if (!rows.length) return;
    var TALT = {"reiki1": "Hands resting on a person during a Reiki session", "orb": "Soft pink and orange gradient orb", "lake": "A figure meditating by a calm lake beneath a mountain at sunrise", "sea": "A deep blue sea seen from a green headland", "hands": "Blurred hands pressed together in prayer", "waves": "A figure sitting on a hill beneath rainbow waves of light", "sit": "A person sitting quietly in a sunlit room", "bloom": "A blurred blue flower against a peach sky", "daisy": "A single daisy against a dusk sky", "write": "A person writing in a journal in soft light", "grad": "Red, orange and green gradient artwork", "g2": "Soft blue and cream gradient artwork", "woman": "A woman sitting calmly in warm sunlight", "fig": "A glowing figure in lavender mist", "g3": "Soft pink and blue gradient artwork", "hero": "Stylised lotus pads on blue water beneath an orange sun", "reiki2": "A practitioner giving Reiki to a woman resting", "g1": "Soft yellow and peach gradient artwork", "grass": "A woman in headphones writing in a notebook on the grass", "avatar": "Portrait of a student"};
    var data = [
      [['Reiki', 'reiki1'], ['Breath', 'orb'], ['Stillness', 'lake'], ['Calm', 'sea'], ['Intention', 'hands'], ['Clarity', 'waves'], ['Presence', 'sit'], ['Soften', 'bloom']],
      [['Gratitude', 'daisy'], ['Journaling', 'write'], ['Release', 'grad'], ['Switch Words', 'g2'], ['Meditation', 'woman'], ['Self-trust', 'fig'], ['Rest', 'g3'], ['Wholeness', 'hero']],
      [['Energy', 'reiki2'], ['Mindful', 'g1'], ['Gentle', 'bloom'], ['Heal with me', 'grass'], ['Listen', 'avatar'], ['Balance', 'sea'], ['Bloom', 'daisy'], ['Within', 'fig']]
    ];
    rows.forEach(function (row, i) {
      var set = document.createElement('div'); set.className = 'insp-set';
      data[i].forEach(function (it) {
        var s = document.createElement('span'); s.className = 'insp-item';
        var w = document.createElement('span'); w.textContent = it[0];
        var c = document.createElement('span'); c.className = 'c'; c.textContent = ',';
        var im = document.createElement('img'); im.alt = TALT[it[1]] || it[0]; im.src = IMG['t_' + it[1]] || '';
        s.appendChild(w); s.appendChild(im); s.appendChild(c); set.appendChild(s);
      });
      row.appendChild(set); row.appendChild(set.cloneNode(true));
    });
    /* time-based loop: constant speed, wraps seamlessly, runs only while on screen */
    var st = [], visible = false, lastT = 0;
    rows.forEach(function (row) {
      st.push({ el: row, dir: row.getAttribute('data-dir') === 'l' ? -1 : 1, sp: parseFloat(row.getAttribute('data-speed')) || 80, x: 0, w: 0 });
    });
    function measure() {
      st.forEach(function (s) {
        var w = s.el.firstChild.getBoundingClientRect().width || s.el.firstChild.offsetWidth;
        if (w && Math.abs(w - s.w) > 0.5) { s.w = w; if (s.dir > 0) s.x = -w * ((0.37 * (st.indexOf(s) + 1)) % 1); else s.x = -w * 0.2; }
      });
    }
    function tick(now) {
      if (!visible) { lastT = 0; return; }
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now;
      st.forEach(function (s) {
        if (!s.w) return;
        s.x += s.dir * s.sp * dt;
        if (s.dir > 0 && s.x >= 0) s.x -= s.w;
        if (s.dir < 0 && s.x <= -s.w) s.x += s.w;
        s.el.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,0,0)';
      });
      requestAnimationFrame(tick);
    }
    measure();
    window.addEventListener('resize', measure);
    var host = document.querySelector('.insp');
    function go(v) { if (v && !visible) { visible = true; measure(); requestAnimationFrame(tick); } else if (!v) visible = false; }
    if (reduce) { measure(); st.forEach(function (s) { s.el.style.transform = 'translate3d(' + (s.dir > 0 ? -s.w : 0) + 'px,0,0)'; }); }
    else if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { go(es[0].isIntersecting); }, { rootMargin: '100px' }).observe(host);
    else go(true);
  })();

  /* ----- Courses: each row pins, the next slides over it ----- */
  var crows = Array.prototype.slice.call(document.querySelectorAll('.crow'));
  function stack() {
    var vh = window.innerHeight || 800;
    crows.forEach(function (r) { var h = r.offsetHeight; if (h) r.style.setProperty('--stk', Math.min(72, vh - h).toFixed(0) + 'px'); });
  }
  if (window.ResizeObserver) { var sro = new ResizeObserver(stack); crows.forEach(function (r) { sro.observe(r); }); }
  window.addEventListener('resize', stack); stack();

  /* ----- Parallax on cards and images ----- */
  if (!reduce) {
    var pcards = Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
    var pimgs = Array.prototype.slice.call(document.querySelectorAll('[data-par-img]'));
    var pTick = false;
    function parallax() {
      pTick = false;
      var vh = window.innerHeight || 800;
      pcards.forEach(function (el) {
        if (el.offsetParent === null) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var p = ((r.top + r.height / 2) - vh / 2) / vh;
        p = Math.max(-1, Math.min(1, p));
        el.style.setProperty('--cy', (p * 22 * parseFloat(el.getAttribute('data-par'))).toFixed(1) + 'px');
      });
      pimgs.forEach(function (el) {
        if (el.offsetParent === null) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var p = ((r.top + r.height / 2) - vh / 2) / vh;
        p = Math.max(-1, Math.min(1, p));
        el.style.setProperty('--py', (-p * r.height * 0.07).toFixed(1) + 'px');
      });
    }
    function req() { if (!pTick) { pTick = true; requestAnimationFrame(parallax); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    document.addEventListener('click', function () { setTimeout(req, 80); });
    req();
  }

  /* ----- Fluid image reveal: same settings as the Framer FluidImageReveal component ----- */
  var FLUID = { brushSize: 30, stretch: 0.65, edgeSoftness: 0.9, followEase: 0.28, fadeTime: 1.1, keepReveal: false };
  (function () {
    var card = document.querySelector('[data-fluid]');
    if (!card || reduce) return;
    var cv = card.querySelector('.fluid-cv'), ctx = cv.getContext('2d');
    var mask = document.createElement('canvas'), mctx = mask.getContext('2d');
    var img = new Image(), ready = false;
    img.onload = function () { ready = true; };
    img.src = IMG.waves;
    var dpr = 1;
    var resize = function () {
      var r = card.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = mask.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = mask.height = Math.max(1, Math.round(r.height * dpr));
      buildSprite();
    };
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(card); else window.addEventListener('resize', resize);
    var tx = 0, ty = 0, bx = 0, by = 0, svx = 0, svy = 0, inside = false, running = false, last = 0, stopAt = 0;
    var sprite = null, SR = 0, stamps = [];
    function buildSprite() {
      SR = FLUID.brushSize * 1.45;
      var soft = Math.min(Math.max(FLUID.edgeSoftness, 0.02), 0.98), px = Math.max(2, Math.ceil(SR * 2 * dpr));
      sprite = document.createElement('canvas'); sprite.width = sprite.height = px;
      var sc = sprite.getContext('2d'), g = sc.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
      var i, N = 12;
      for (i = 0; i <= N; i++) {
        var u = i / N, e = u <= 1 - soft ? 1 : Math.pow(1 - (u - (1 - soft)) / soft, 2) * (3 - 2 * (1 - (u - (1 - soft)) / soft));
        g.addColorStop(u, 'rgba(0,0,0,' + Math.max(0, Math.min(1, e)).toFixed(3) + ')');
      }
      sc.fillStyle = g; sc.fillRect(0, 0, px, px);
    }
    buildSprite();
    function frame(t) {
      var dt = last ? Math.min(50, t - last) : 16; last = t;
      var k = 1 - Math.pow(1 - FLUID.followEase, dt / 16.67), life = FLUID.fadeTime * 1000;
      if (inside) {
        var nx = bx + (tx - bx) * k, ny = by + (ty - by) * k;
        var dx = nx - bx, dy = ny - by, dist = Math.sqrt(dx * dx + dy * dy);
        var sp = dist / dt * 16.67, ang = dist > 0.01 ? Math.atan2(dy, dx) : 0;
        var sx = 1 + FLUID.stretch * Math.min(sp / 10, 2.5);
        var n = Math.max(1, Math.ceil(dist / Math.max(1.5, FLUID.brushSize * 0.18)));
        for (var i = 1; i <= n; i++) stamps.push({ x: bx + dx * i / n, y: by + dy * i / n, a: ang, s: sx, t: t - dt * (1 - i / n) });
        bx = nx; by = ny;
      }
      mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.clearRect(0, 0, mask.width, mask.height);
      var keep = FLUID.keepReveal, j = 0;
      for (var q = 0; q < stamps.length; q++) {
        var s = stamps[q], age = t - s.t;
        if (!keep && age >= life) continue;
        stamps[j++] = s;
        var u = keep ? 0 : age / life;
        mctx.globalAlpha = (1 - u) * (1 - u) * (3 - 2 * (1 - u)) ;
        mctx.setTransform(dpr, 0, 0, dpr, 0, 0); mctx.translate(s.x, s.y); mctx.rotate(s.a); mctx.scale(s.s, 1);
        mctx.drawImage(sprite, -SR, -SR, SR * 2, SR * 2);
        mctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      stamps.length = j; mctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, cv.width, cv.height);
      if (ready && stamps.length) {
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        var s0 = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
        var dw = img.naturalWidth * s0, dh = img.naturalHeight * s0;
        ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
        ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(mask, 0, 0); ctx.globalCompositeOperation = 'source-over';
      }
      if (inside || stamps.length) requestAnimationFrame(frame);
      else { running = false; }
    }
    function go() { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } }
    function pos(e) { var b = card.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; }
    card.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; pos(e); bx = tx; by = ty; inside = true; go(); });
    card.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; pos(e); if (!inside) { bx = tx; by = ty; inside = true; go(); } });
    card.addEventListener('pointerleave', function () { inside = false; });
  })();

  /* ----- hero parallax: the traffic light scrolls slower than the sky. It starts 150px from the top of the frame and stops 150px from the bottom ----- */
  (function () {
    var fg = document.querySelector('.hero5-fg');
    if (!fg || reduce) return;
    var box = fg.parentElement.parentElement, ticking = false;
    var LT = 195, LB = 405, IW = 1024, IH = 572;   /* top and bottom of the traffic light in the source photo */
    var y0 = 0, y1 = 0, range = 1;
    function measure() {
      var W = box.offsetWidth, H = box.offsetHeight;
      var sc = Math.max(W / IW, H / IH), offY = (H - IH * sc) * 0.52;
      var top = offY + LT * sc, bottom = offY + LB * sc, lh = bottom - top;
      var m = Math.min(150, Math.max(0, (H - lh) * 0.3));
      y0 = m - top;               /* light's top edge sits m px below the frame top */
      y1 = (H - m) - bottom;      /* light's bottom edge sits m px above the frame bottom */
      range = Math.max(1, (box.getBoundingClientRect().top + (window.scrollY || 0) + H * 0.7) * 2);   /* 2x slower */
    }
    function upd() {
      ticking = false;
      var p = Math.min(1, Math.max(0, (window.scrollY || 0) / range));
      fg.style.translate = '0 ' + (y0 + (y1 - y0) * p).toFixed(1) + 'px';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', function () { measure(); upd(); });
    window.addEventListener('load', function () { measure(); upd(); });
    measure(); upd();
  })();

  /* ----- hero flower: petals sway and the powder drifts on a soft wind (WebGL, falls back to the still image) ----- */
  (function () {
    var cv = document.querySelector('.hero5-cv'), img = document.querySelector('.hero5-bg');
    if (!cv || !img || reduce) return;
    var box = cv.parentElement;
    var gl = cv.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    var vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
    var fs = 'precision mediump float;varying vec2 v;uniform sampler2D t;uniform float T;uniform vec2 R;uniform vec2 I;' +
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}' +
      /* the picture is fitted by height, so on wide screens the black sides simply continue */
      'vec2 fit(vec2 q){float s=R.y/I.y;return vec2((q.x-.5)*R.x/(I.x*s)+.5,q.y);}' +
      /* a gust that travels left to right, plus small turbulence */
      'vec2 wind(vec2 u,float T){float g=.5+.5*sin(T*.55-u.x*3.2+sin(T*.21)*1.4);' +
      'return vec2(.75+.55*g+.25*(n(u*3.+T*.25)-.5),-.18+.2*(n(u*4.-T*.2)-.5));}' +
      'void main(){vec2 u=fit(v);' +
      /* slow breathing zoom around the heart of the flower */
      'vec2 c=vec2(.5,.78);float z=1.-.016*(.5+.5*sin(T*.16));u=c+(u-c)*z;' +
      'vec2 asp=vec2(I.x/I.y,1.);vec2 d=(u-c)*asp;float r=length(d);' +
      /* petals: the further from the heart, the more they lean with the gust and flutter */
      'float amp=smoothstep(.06,.55,r);vec2 W=wind(u,T);' +
      'vec2 sw=W*.0125*amp+vec2(n(u*5.+T*.45)-.5,n(u*5.7-T*.4+9.)-.5)*.014*amp;' +
      'vec2 q=u-sw/asp;' +
      /* powder: grains stream downwind in two overlapping phases, strongest at the edges */
      'float dm=smoothstep(.22,.6,r);vec2 W2=wind(u,T*.8)*vec2(1.,1.);' +
      'float p0=fract(T*.055),p1=fract(T*.055+.5);float w0=1.-abs(2.*p0-1.),w1=1.-abs(2.*p1-1.);' +
      'vec3 a=texture2D(t,clamp(q-W2*.085*p0*dm/asp,0.,1.)).rgb;vec3 b=texture2D(t,clamp(q-W2*.085*p1*dm/asp,0.,1.)).rgb;' +
      'vec3 col=(a*w0+b*w1)/max(w0+w1,.0001);' +
      /* a faint warm shimmer travels across with the gust */
      'float sh=.5+.5*sin(T*.55-u.x*3.2+sin(T*.21)*1.4);col*=1.+.07*sh*smoothstep(.1,.5,r);' +
      /* fade into black before the edge of the photo, so wide screens never stretch it */
      'col*=smoothstep(0.,.07,q.x)*smoothstep(0.,.07,1.-q.x)*smoothstep(0.,.05,q.y);' +
      'gl_FragColor=vec4(col,1.);}';
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var pr = gl.createProgram(), a = sh(gl.VERTEX_SHADER, vs), b = sh(gl.FRAGMENT_SHADER, fs);
    if (!a || !b) return;
    gl.attachShader(pr, a); gl.attachShader(pr, b); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uT = gl.getUniformLocation(pr, 'T'), uR = gl.getUniformLocation(pr, 'R'), uI = gl.getUniformLocation(pr, 'I');
    var tex = gl.createTexture(), ready = false, vis = false, raf = 0, t0 = performance.now();
    function load() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(pr, 't'), 0);
      gl.uniform2f(uI, img.naturalWidth, img.naturalHeight);
      ready = true; size(); frame(); cv.classList.add('on');
    }
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = Math.max(2, Math.round(box.clientWidth * dpr)), h = Math.max(2, Math.round(box.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      gl.viewport(0, 0, w, h); gl.uniform2f(uR, w, h);
    }
    function frame() { gl.uniform1f(uT, (performance.now() - t0) / 1000 + 3); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
    function loop() { if (!vis) { raf = 0; return; } frame(); raf = requestAnimationFrame(loop); }
    new IntersectionObserver(function (en) {
      vis = en[0].isIntersecting;
      if (vis && ready && !raf) raf = requestAnimationFrame(loop);
    }).observe(box);
    window.addEventListener('resize', function () { if (ready) { size(); frame(); } });
    if (img.complete && img.naturalWidth) load(); else img.addEventListener('load', load);
  })();

  /* ----- living hero: drifting pollen ----- */
  var art = document.querySelector('.hero-live .art');
  if (art && !reduce) {
    for (var n = 0; n < 16; n++) {
      var f = document.createElement('i');
      f.className = 'fly';
      f.style.cssText = 'left:' + (4 + Math.random() * 92).toFixed(1) + '%;top:' + (38 + Math.random() * 58).toFixed(1) + '%;--s:' + (2.5 + Math.random() * 3.5).toFixed(1) + 'px;animation-duration:' + (7 + Math.random() * 8).toFixed(1) + 's;animation-delay:-' + (Math.random() * 12).toFixed(1) + 's';
      art.appendChild(f);
    }
  }


  /* ----- living hero: clouds drift, flowers bloom in slow waves, the meadow sways (WebGL, falls back to the still image) ----- */
  (function () {
    var box = document.querySelector('.hero-water'), cv = box && box.querySelector('.water-cv'), img = box && box.querySelector('img');
    if (!cv || !img || reduce) return;
    var gl = cv.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    var vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
    var fs = 'precision mediump float;varying vec2 v;uniform sampler2D t;uniform float T;uniform vec2 R;uniform vec2 I;uniform vec2 P;' +
      'vec2 cover(vec2 uv){float ra=R.x/R.y,ia=I.x/I.y;vec2 s=ra>ia?vec2(1.,ia/ra):vec2(ra/ia,1.);return (uv-.5)*s+.5;}' +
      /* how pink or purple a colour is: flowers only, never grass, sky, clouds or the yellow dress */
      'float pkc(vec3 c,float y){return clamp(((c.r+c.b)*.5-c.g)*3.,0.,1.)*smoothstep(.44,.52,y);}' +
      'void main(){vec2 u=cover(v);' +
      /* slow breathing zoom around the girl and a slow camera drift */
      'float z=.93-.018*sin(T*.09);vec2 f=vec2(.5,.44);u=f+(u-f)*z;' +
      'float depth=smoothstep(.40,.95,u.y);u+=P*(.003+.012*depth);' +
      /* keep the girl and her chair steady */
      'vec2 g=(u-vec2(.5,.42))/vec2(.06,.11);float keep=smoothstep(.85,1.6,length(g));' +
      /* clouds drift sideways in the sky only */
      'float sky=1.-smoothstep(.43,.53,u.y);' +
      'u+=vec2(sin(T*.11)*.0105+sin(T*.23+u.y*6.)*.0035,cos(T*.09)*.003)*sky*keep;' +
      /* a light breeze moves the meadow */
      'float fg=smoothstep(.52,.9,u.y);' +
      'float sw=sin(u.x*11.+T*1.1+u.y*5.)+.5*sin(u.x*23.-T*.8)+.8*sin(u.x*3.-T*.7);' +
      'u.x+=sw*.0020*fg*keep;u.y+=cos(u.x*9.+T*.9)*.0010*fg*keep;' +
      /* blooming: a slow wave rolls across the meadow; every pink flower opens outward, then settles */
      'float w=.5+.5*sin(T*.85-(u.x*4.6+u.y*3.2));float bl=w*w*(3.-2.*w);' +
      'float zone=smoothstep(.46,.62,u.y)*keep;' +
      'float rr=(.0032+.0075*depth)*bl*zone;vec2 asp=vec2(1.,I.x/I.y);' +
      'vec3 base=texture2D(t,clamp(u,0.,1.)).rgb;float pb=pkc(base,u.y);vec3 bc=base;float best=pb;' +
      'for(int i=0;i<6;i++){float a=float(i)*1.0472+T*.12;vec2 d=vec2(cos(a),sin(a))*asp;' +
      'vec3 c1=texture2D(t,clamp(u+d*rr,0.,1.)).rgb;float p1=pkc(c1,u.y);if(p1>best){best=p1;bc=c1;}' +
      'vec3 c2=texture2D(t,clamp(u+d*rr*.5,0.,1.)).rgb;float p2=pkc(c2,u.y);if(p2>best){best=p2;bc=c2;}}' +
      'vec3 col=mix(base,bc,clamp((best-pb)*2.4,0.,1.)*.92);' +
      /* a soft warm glow in the petals as they open */
      'col=mix(col,col*vec3(1.10,.96,1.06)+.025,pkc(col,u.y)*bl*zone*.5);' +
      'gl_FragColor=vec4(col,1.);}';
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var pr = gl.createProgram(), a = sh(gl.VERTEX_SHADER, vs), b = sh(gl.FRAGMENT_SHADER, fs);
    if (!a || !b) return;
    gl.attachShader(pr, a); gl.attachShader(pr, b); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uT = gl.getUniformLocation(pr, 'T'), uR = gl.getUniformLocation(pr, 'R'), uI = gl.getUniformLocation(pr, 'I'), uP = gl.getUniformLocation(pr, 'P');
    var tex = gl.createTexture(), ready = false, vis = false, raf = 0, t0 = performance.now();
    function load() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(pr, 't'), 0);
      gl.uniform2f(uI, img.naturalWidth, img.naturalHeight);
      ready = true; size(); frame(); cv.classList.add('on');
    }
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = Math.max(2, Math.round(box.clientWidth * dpr)), h = Math.max(2, Math.round(box.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      gl.viewport(0, 0, w, h); gl.uniform2f(uR, w, h);
    }
    function frame() {
      var now = (performance.now() - t0) / 1000;
      /* the camera drifts on its own, slowly; nothing reacts to the cursor */
      gl.uniform2f(uP, Math.sin(now * .13) * .6, Math.cos(now * .1) * .4);
      gl.uniform1f(uT, now);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function loop() { if (!vis) { raf = 0; return; } frame(); raf = requestAnimationFrame(loop); }
    new IntersectionObserver(function (en) {
      vis = en[0].isIntersecting;
      if (vis && ready && !raf) raf = requestAnimationFrame(loop);
    }).observe(box);
    window.addEventListener('resize', function () { if (ready) { size(); frame(); } });
    if (img.complete && img.naturalWidth) load(); else img.addEventListener('load', load);
  })();

  /* ----- custom circle cursor ----- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var dot = document.querySelector('.cur-dot');
    var x = -100, y = -100, rx = -100, ry = -100, seen = false;
    root.classList.add('has-cursor');
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!seen) { seen = true; rx = x; ry = y; root.classList.add('cur-on'); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { root.classList.remove('cur-on'); seen = false; });
    var lab = dot.querySelector('b');
    document.addEventListener('mouseover', function (e) {
      var c = e.target && e.target.closest ? e.target : (e.target && e.target.parentElement);
      if (!c) return;
      var label = c.closest('[data-cursor]');
      var field = !label && c.closest('input, textarea, select, [data-fluid]');
      var link = !label && !field && c.closest('a, button, .pill');
      var media = !label && !field && !link && c.closest('.imgr');
      if (label) lab.textContent = label.getAttribute('data-cursor');
      root.classList.toggle('cur-label', !!label);
      root.classList.toggle('cur-field', !!field);
      root.classList.toggle('cur-link', !!link);
      root.classList.toggle('cur-media', !!media);
    });
    window.addEventListener('mousedown', function () { root.classList.add('cur-down'); });
    window.addEventListener('mouseup', function () { root.classList.remove('cur-down'); });
    (function tick() {
      var k = reduce ? 1 : 0.3;
      rx += (x - rx) * k; ry += (y - ry) * k;
      dot.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(tick);
    })();
  }
})();
