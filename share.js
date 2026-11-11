/* Sharing for listing pages. Edit LISTING below for each home. */
const LISTING = window.LISTING || {
  address: "1056 Old Hampton Rd, Boone, NC 28607",
  price: "$XXX,XXX",
  zillow: "https://www.zillow.com/homedetails/1056-Old-Hampton-Rd-Boone-NC-28607/99379549_zpid/",
  phone: "+18284045335",
};

document.addEventListener("DOMContentLoaded", () => {
  const url = location.href.split("#")[0];
  const msg = `Check out this home: ${LISTING.address} (${LISTING.price})`;
  const toast = document.createElement("div"); toast.className = "toast"; document.body.appendChild(toast);
  const say = (t) => { toast.textContent = t; toast.classList.add("on"); setTimeout(() => toast.classList.remove("on"), 2200); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); }
    catch { const t = document.createElement("textarea"); t.value = url; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
    say("Link copied! Paste it anywhere.");
  };
  const actions = {
    share: async () => { if (navigator.share) { try { await navigator.share({ title: LISTING.address, text: msg, url }); } catch {} } else copy(); },
    copy,
    text: () => (location.href = `sms:?&body=${encodeURIComponent(msg + " " + url)}`),
    email: () => (location.href = `mailto:?subject=${encodeURIComponent("Home for sale: " + LISTING.address)}&body=${encodeURIComponent(msg + "\n\n" + url)}`),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,width=640,height=560"),
  };
  document.querySelectorAll("[data-share]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); actions[b.dataset.share](); }));

  // Elite-style text motion
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  const split = (h, start, wait) => {
    const parts = h.innerHTML.split(/(<em>.*?<\/em>|\s+)/).filter((p) => p && p.trim());
    h.innerHTML = parts.map((p, i) => `<span class="w"><span style="animation-delay:${start + i * 0.12}s">${p}</span></span>`).join(" ");
    h.classList.add("split-words");
    if (wait) { h.classList.add("wait"); io.observe(h); }
  };
  document.querySelectorAll("h1").forEach((h) => { h.classList.remove("up", "d1", "d2"); split(h, 0.2, false); });
  document.querySelectorAll("section h2").forEach((h) => { if (!h.closest(".hero, .frame")) split(h, 0.1, true); });
  document.querySelectorAll(".section .eyebrow, .section h2 ~ p, .section ul, .gallery, .facts, .remarks, .card").forEach((el) => {
    if (el.closest(".hero, .frame") || el.classList.contains("up")) return;
    el.classList.add("reveal"); io.observe(el);
  });
  document.querySelectorAll("[data-zillow]").forEach((a) => { a.href = LISTING.zillow; a.target = "_blank"; a.rel = "noopener"; });
});
