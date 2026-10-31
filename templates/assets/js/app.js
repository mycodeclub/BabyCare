/* Aanchal UI template — small, dependency-free interactions */
(function () {
  // Sticky nav shadow (landing)
  const nav = document.querySelector('.l-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile sidebar (admin / user)
  const sb = document.querySelector('.sidebar');
  const bd = document.querySelector('.offcanvas-backdrop-a');
  document.querySelectorAll('[data-toggle-sidebar]').forEach(btn => btn.addEventListener('click', () => {
    sb && sb.classList.toggle('open'); bd && bd.classList.toggle('show');
  }));
  bd && bd.addEventListener('click', () => { sb.classList.remove('open'); bd.classList.remove('show'); });

  // Journey tabs (landing)
  const tabs = document.querySelectorAll('.journey-tabs .jt');
  tabs.forEach((t, i) => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.journey-panel').forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    const p = document.getElementById(t.dataset.target); p && p.classList.add('active');
    document.querySelectorAll('.timeline-bar span').forEach((s, j) => s.classList.toggle('on', j <= i));
  }));

  // Generic single-select groups: [data-select-group] > [data-option]
  document.querySelectorAll('[data-select-group]').forEach(group => {
    group.addEventListener('click', e => {
      const opt = e.target.closest('[data-option]');
      if (!opt || opt.disabled || !group.contains(opt)) return;
      const multi = group.hasAttribute('data-multi');
      if (!multi) group.querySelectorAll('[data-option]').forEach(o => o.classList.remove('sel', 'active'));
      opt.classList.toggle(group.dataset.cls || 'sel', multi ? undefined : true);
      group.dispatchEvent(new CustomEvent('change-sel', { bubbles: true }));
    });
  });

  // Pricing segment toggle (landing)
  document.querySelectorAll('[data-pack-filter]').forEach(seg => seg.addEventListener('change-sel', () => {
    const v = seg.querySelector('.active')?.dataset.option || 'all';
    document.querySelectorAll('[data-pack]').forEach(c => {
      c.closest('.col').style.display = (v === 'all' || c.dataset.pack.includes(v)) ? '' : 'none';
    });
  }));

  // Booking flow (user/book.html)
  const book = document.getElementById('bookFlow');
  if (book) {
    const fmt = n => '₹' + n.toLocaleString('en-IN');
    const recalc = () => {
      const sel = [...book.querySelectorAll('.svc-opt.sel')];
      const list = document.getElementById('sumList'); list.innerHTML = '';
      let total = 0;
      sel.forEach(s => {
        const p = +s.dataset.price; total += p;
        list.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-between fs-sm mb-2"><span>${s.dataset.name}</span><span>${fmt(p)}</span></div>`);
      });
      if (!sel.length) list.innerHTML = '<div class="fs-sm text-muted-a">No service selected yet</div>';
      const useCredits = document.getElementById('useCredits')?.checked;
      const credit = useCredits ? Math.min(total, 1200) : 0;
      document.getElementById('sumCredit').textContent = '− ' + fmt(credit);
      document.getElementById('sumTotal').textContent = fmt(total - credit);
      const timing = book.querySelector('.timing .sel')?.dataset.label || '—';
      const day = book.querySelector('.days .sel')?.dataset.label || '—';
      const slot = book.querySelector('.slots .sel')?.textContent || '—';
      document.getElementById('sumWhen').textContent = timing === 'Plan schedule' ? 'Auto-scheduled from your plan' : `${day} · ${slot}`;
      document.getElementById('sumTiming').textContent = timing;
      const steps = document.querySelectorAll('.stepper .s');
      const done = [sel.length > 0, !!book.querySelector('.timing .sel'), !!book.querySelector('.slots .sel') || timing === 'Plan schedule', false];
      steps.forEach((s, i) => s.classList.toggle('on', i === 0 || done[i - 1]));
    };
    book.addEventListener('change-sel', recalc);
    book.addEventListener('change', recalc);
    recalc();
  }
})();
