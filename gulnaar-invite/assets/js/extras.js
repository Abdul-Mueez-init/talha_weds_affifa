/**
 * EXTRA SECTIONS
 * --------------
 * Renders the sections that sit around the core invitation: photo bands,
 * gentle customs (etiquette), blessing cards, hosts & contact and the RSVP
 * form. All copy comes from config.js — nothing here needs editing per client.
 * Runs before app.js's DOMContentLoaded handler so the scroll-reveal observer
 * picks up everything added here.
 */
(() => {
  "use strict";

  const config = window.INVITATION_CONFIG;
  if (!config) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const TITLES = /^(dr|dr\.|mr|mr\.|mrs|mrs\.|ms|ms\.|miss|prof|prof\.|er|er\.|engr|engr\.|capt|capt\.|col|col\.|major|hafiz|hafiza|maulana|moulana|mohd|mohd\.|md|md\.|mohammad|muhammad|mohammed|syed|sayyed|sk|late|shri|smt|sri)$/i;
  const firstName = (full) => {
    const w = String(full || "").trim().split(/\s+/).filter(Boolean);
    let n = 0;
    while (n < w.length - 1 && TITLES.test(w[n])) n++;
    return w.slice(0, n + 1).join(" ");
  };
  const shortName = (p) => String((p && p.shortName) || "").trim() || firstName(p && p.name);
  const digits = (value) => String(value || "").replace(/[^\d+]/g, "");
  const setIcon = (node, name) => {
    node.innerHTML = ICONS[name] || ICONS.crescent;
  };

  const svg = (body) =>
    `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  const ICONS = {
    dress: svg('<path d="M20 10a3 3 0 1 1 3 3c-1.7 0-3 1-3 2.6V18"/><path d="M20 18 6.5 28.4A2 2 0 0 0 7.7 32h24.6a2 2 0 0 0 1.2-3.6z"/>'),
    clock: svg('<circle cx="20" cy="20" r="14"/><path d="M20 11v9l6 4"/>'),
    silent: svg('<rect x="12" y="5" width="16" height="30" rx="3.5"/><path d="M18 30h4"/><path d="M16.5 15.5l7 7M23.5 15.5l-7 7"/>'),
    crescent: svg('<path d="M26 8.5A12.5 12.5 0 1 0 26 31.5a10 10 0 1 1 0-23z"/><path d="m30 14 1 2.4 2.6.2-2 1.7.6 2.5-2.2-1.4-2.2 1.4.6-2.5-2-1.7 2.6-.2z"/>'),
    camera: svg('<path d="M6 13h6l2-3h12l2 3h6v19H6z"/><circle cx="20" cy="22" r="5.5"/>'),
    plate: svg('<ellipse cx="20" cy="24" rx="15" ry="8"/><circle cx="14" cy="23" r="3"/><circle cx="22" cy="21" r="3"/><path d="M17 7c-1.5 2 1.5 3 0 5M23 7c-1.5 2 1.5 3 0 5"/>'),
    heart: svg('<path d="M20 33C8 25 6 17 10 12.5c3.5-4 8.5-2 10 2 1.5-4 6.5-6 10-2 4 4.5 2 12.5-10 20.5z"/>'),
    gift: svg('<path d="M7 17h26v16H7z"/><path d="M5 12h30v5H5z"/><path d="M20 12v21"/><path d="M20 12c-3-6-9-5-8-1.5M20 12c3-6 9-5 8-1.5"/>'),
    phone: svg('<path d="M12 6h6l2 7-3.5 2.2a17 17 0 0 0 7.3 7.3L26 19l7 2v6a3 3 0 0 1-3 3C16.5 30 8 21.5 8 10a3 3 0 0 1 3-3z"/>'),
  };

  /* ---------- photo bands: full-width photographs between sections ---------- */
  function renderBands() {
    const photos = (config.media && config.media.gallery) || [];
    document.querySelectorAll("[data-band]").forEach((band) => {
      const index = Number(band.dataset.band) || 0;
      const photo = photos[index % Math.max(photos.length, 1)];
      const copy = (config.bands || [])[index] || {};

      if (!photo) {
        band.remove();
        return;
      }

      const image = $("img", band);
      image.src = photo.src;
      image.alt = photo.alt || "";
      $(".x-band__q", band).textContent = copy.quote || "";
      $(".x-band__s", band).textContent = copy.sub || "";
      if (!copy.quote && !copy.sub) $(".x-band__veil", band).remove();
    });
  }

  /* ---------- blessing cards ---------- */
  function renderGiftCards() {
    const mount = $("#giftCards");
    if (!mount) return;

    const items = (config.blessings && config.blessings.items) || [];
    items.forEach((item, index) => {
      const card = el("div", "x-gift rv");
      card.style.setProperty("--i", index);
      const icon = el("span", "x-gift__ic");
      setIcon(icon, item.icon);
      card.append(icon, el("h3", "", item.title), el("p", "", item.text));
      mount.append(card);
    });

    if (!items.length) mount.remove();
  }

  /* ---------- hosts & contact ---------- */
  function renderContacts() {
    const mount = $("#contactCards");
    if (!mount) return;

    const people = config.contacts || [];

    const intlDigits = (phone) => {
      const d = String(phone || "").replace(/\D/g, "");
      if (d.startsWith("0")) return "92" + d.slice(1);
      if (d.startsWith("92")) return d;
      return d ? "92" + d : "";
    };

    people.forEach((person, index) => {
      const card = el("article", "x-contact rv");
      card.style.setProperty("--i", index);

      if (person.name) card.append(el("h3", "x-contact__person", person.name));
      if (person.phone) card.append(el("p", "x-contact__tel", person.phone));

      const intl = intlDigits(person.phone);
      if (intl) {
        const actions = el("div", "x-contact__actions");

        const wa = el("a", "x-btn x-contact__wa", "Chat on WhatsApp");
        wa.href = `https://wa.me/${intl}`;
        wa.target = "_blank";
        wa.rel = "noopener";

        const call = el("a", "x-btn x-contact__call", "Call");
        call.href = `tel:+${intl}`;

        actions.append(wa, call);
        card.append(actions);
      }

      mount.append(card);
    });

    if (!people.length) mount.closest("section")?.remove();
  }

  /* ---------- mehendi: full-width invitation panel ---------- */
  function buildEventPanel(event, index) {
    const hasGroups = Array.isArray(event.groups) && event.groups.length;
    const panel = el(
      "article",
      "event-panel rv" + (hasGroups ? " event-panel--groups" : ""),
    );
    panel.style.setProperty("--i", index);

    const mandala = el("span", "event-panel__mandala");
    let petals = "";
    for (let i = 0; i < 8; i += 1) {
      petals += `<ellipse cx="28" cy="9" rx="2.6" ry="6.5" transform="rotate(${i * 45} 28 28)"/>`;
    }
    mandala.innerHTML =
      '<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">' +
      '<circle cx="28" cy="28" r="25" fill="none" stroke="#B83A62" stroke-width="1.1"/>' +
      '<circle cx="28" cy="28" r="18" fill="none" stroke="#B83A62" stroke-width="0.8" opacity="0.7"/>' +
      `<g fill="none" stroke="#B83A62" stroke-width="0.9" opacity="0.75">${petals}</g>` +
      '<circle cx="28" cy="28" r="3.6" fill="#D6A03C"/>' +
      "</svg>";
    panel.append(mandala);

    const title = el("p", "event-panel__title notranslate", event.panelTitle || "مہندی");
    title.lang = "ur";
    title.dir = "rtl";
    title.setAttribute("translate", "no");
    panel.append(title);

    if (event.hosts) panel.append(el("p", "event-panel__hosts", event.hosts));
    if (event.inviteLine) panel.append(el("p", "event-panel__invite", event.inviteLine));
    if (event.groomName) panel.append(el("p", "event-panel__groom", event.groomName));

    panel.append(el("span", "event-panel__divider"));
    if (event.dateLine) panel.append(el("p", "event-panel__date", event.dateLine));

    const renderRows = (rows) => {
      const list = el("ul", "event-panel__schedule");
      (rows || []).forEach((row) => {
        const item = el("li");
        item.append(
          el("span", "event-panel__time", row.time || ""),
          el("span", "event-panel__what", row.label || ""),
        );
        list.append(item);
      });
      return list;
    };

    if (hasGroups) {
      const wrap = el("div", "event-panel__groups");
      event.groups.forEach((group) => {
        const block = el("div", "event-panel__group");
        if (group.label) block.append(el("p", "event-panel__group-label", group.label));
        if (group.address) block.append(el("p", "event-panel__group-address", group.address));
        block.append(renderRows(group.rows));
        wrap.append(block);
      });
      panel.append(wrap);
    } else if (Array.isArray(event.schedule) && event.schedule.length) {
      panel.append(renderRows(event.schedule));
    }

    if (event.location || event.address) {
      const venue = el("div", "event-panel__venue");
      if (event.location) venue.append(el("strong", "", event.location));
      if (event.address) venue.append(el("span", "", event.address));
      panel.append(venue);
    }

    const actions = el("div", "event-panel__actions");
    const buttons = Array.isArray(event.panelButtons) && event.panelButtons.length
      ? event.panelButtons.map((b) => ({
          label: b.label,
          url: b.url,
          kind: b.kind === "map" ? "map" : "outline",
          download: b.download,
        }))
      : [
          ...(event.mapUrl
            ? [{ label: "VIEW ON MAP", url: event.mapUrl, kind: "map" }]
            : []),
          ...(event.icsHref
            ? [{ label: "ADD TO CALENDAR", url: event.icsHref, kind: "outline", download: "mehendi.ics" }]
            : []),
        ];
    buttons.forEach((b) => {
      if (!b.url) return;
      const btn = el("a", "event-panel__btn", b.label);
      btn.href = b.url;
      if (b.download) btn.setAttribute("download", b.download);
      else {
        btn.target = "_blank";
        btn.rel = "noreferrer";
      }
      actions.append(btn);
    });
    if (actions.children.length) panel.append(actions);

    return panel;
  }

  /* ---------- wedding events ---------- */
  function renderEvents() {
    const mount = $("#eventCards");
    if (!mount) return;

    const arabic = {
      nikah: "نِكَاح", nikaah: "نِكَاح", walima: "وَلِيمَة", waleema: "وَلِيمَة", mehendi: "مہندی",
      mehndi: "مہندی", henna: "مہندی", haldi: "ہلدی", dholki: "ڈھولکی", sangeet: "سنگیت",
      reception: "استقبال", mangni: "منگنی", qawwali: "قوالی", "baat pakki": "بات پکی",
    };
    const icons = {
      rings: svg('<circle cx="15" cy="25" r="9"/><circle cx="26" cy="25" r="9"/><path d="m20 6 3 4-3 4-3-4z"/>'),
      leaf: svg('<path d="M8 32C8 17 17 8 33 8c0 15-8 24-23 24z"/><path d="M8 32 24 16"/>'),
      moon: ICONS.crescent,
      lantern: svg('<path d="M20 4v4M14 8h12M12 12h16l2 14H10zM14 30h12M16 34h8"/><path d="M16 12l-1 14M24 12l1 14"/>'),
      feast: ICONS.plate,
    };
    const iconFor = (key) => {
      if (/nikah|nikaah/.test(key)) return icons.moon;
      if (/mehendi|mehndi|henna|haldi/.test(key)) return icons.leaf;
      if (/reception|sangeet|qawwali|dholki/.test(key)) return icons.lantern;
      if (/walima|waleema|dinner|lunch/.test(key)) return icons.feast;
      return icons.rings;
    };

    const list = [];

    const group = config.inviteGroup || "full";
    const allowedForGroup = (name) => {
      const n = String(name || "").toLowerCase();
      if (group === "walima") return /walima|waleema/.test(n);
      if (group === "mehndi-walima") return /walima|waleema|mehendi|mehndi|henna/.test(n);
      return true;
    };

    (config.preWeddingEvents || []).forEach((event) => {
      if (!allowedForGroup(event.name)) return;
      list.push({
        name: event.name,
        subtitle: "",
        date: event.date,
        time: event.time,
        place: [event.location, event.address].filter(Boolean).join(", "),
        mapUrl: event.mapLink,
        stamp: Date.parse(event.date || "") || 0,
        location: event.location,
        address: event.address,
        panel: !!event.panel,
        panelTitle: event.panelTitle,
        hosts: event.hosts,
        inviteLine: event.inviteLine,
        groomName: event.groomName,
        dateLine: event.dateLine,
        schedule: event.schedule,
        groups: event.groups,
        panelButtons: event.panelButtons,
        icsHref: event.icsHref,
      });
    });

    if (Array.isArray(config.events)) {
      list.length = 0;
      config.events.forEach((event, i) => {
        if (!allowedForGroup(event.name)) return;
        list.push({
          name: event.name,
          subtitle: event.subtitle || "",
          date: event.date,
          time: event.time,
          place: event.place,
          mapUrl: event.mapUrl,
          stamp: i,
          main: false,
          location: event.location,
          address: event.address,
          panel: !!event.panel,
          panelTitle: event.panelTitle,
          hosts: event.hosts,
          inviteLine: event.inviteLine,
          groomName: event.groomName,
          dateLine: event.dateLine,
          schedule: event.schedule,
          groups: event.groups,
          panelButtons: event.panelButtons,
          icsHref: event.icsHref,
        });
      });
    }

    list.sort((x, y) => x.stamp - y.stamp);

    list.forEach((event, index) => {
      if (event.panel) {
        mount.append(buildEventPanel(event, index));
        return;
      }
      const key = String(event.name || "").trim().toLowerCase();
      // an event with no date/time/place of its own just renders without the line
      const card = el("article", "x-event rv" + (event.main ? " is-main" : ""));
      card.style.setProperty("--i", index);

      const badge = el("span", "x-event__badge");
      badge.innerHTML = iconFor(key);
      card.append(badge);

      const arabicText = arabic[key] || arabic[key.split(/[\s·—-]+/)[0]];
      if (arabicText) {
        const ar = el("p", "x-event__ar", arabicText);
        ar.lang = "ar";
        ar.dir = "rtl";
        ar.classList.add("notranslate");
        ar.setAttribute("translate", "no");
        card.append(ar);
      }
      card.append(el("h3", "x-event__name", event.name));
      if (event.subtitle) card.append(el("p", "x-event__sub", event.subtitle));
      card.append(el("span", "x-event__line"));
      card.append(el("p", "x-event__date", event.date || ""));
      if (event.time) card.append(el("p", "x-event__time", event.time));
      if (event.place) card.append(el("p", "x-event__place", event.place));

      if (event.mapUrl) {
        const link = el("a", "x-event__map", "View on map");
        link.href = event.mapUrl;
        link.target = "_blank";
        link.rel = "noreferrer";
        card.append(link);
      }
      mount.append(card);
    });

    if (!list.length) mount.closest("section")?.remove();
  }

  /* ---------- motion: read progress + countdown ticks ---------- */
  function initMotion() {
    const bar = el("div", "x-progress");
    bar.setAttribute("aria-hidden", "true");
    document.body.append(bar);

    let queued = false;
    const update = () => {
      queued = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      bar.style.setProperty("--prog", Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4));
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();

    ["countdownDays", "countdownHours", "countdownMinutes", "countdownSeconds"].forEach((id) => {
      const node = document.getElementById(id);
      if (!node || !("MutationObserver" in window)) return;
      new MutationObserver(() => {
        node.classList.remove("x-pop");
        void node.offsetWidth;
        node.classList.add("x-pop");
      }).observe(node, { childList: true, characterData: true, subtree: true });
    });
  }

  renderBands();
  renderEvents();
  renderGiftCards();
  renderContacts();
  initMotion();
})();
