/**
 * ═══════════════════════════════════════════════════════════════════
 *  YOUR WEDDING DETAILS — EDIT EVERYTHING BELOW
 * ═══════════════════════════════════════════════════════════════════
 *
 * This is the ONLY file you need to edit. Everything on the invitation
 * (names, dates, venue, events, text, colours, WhatsApp number) comes
 * from this file.
 *
 * QUICK CHECKLIST before sharing:
 *   [ ] couple.bride / couple.groom  — names, parents, relation
 *   [ ] wedding.*                    — date & time (isoDate MUST have
 *                                      the correct UTC offset, e.g. +05:30)
 *   [ ] venue.*                      — name, address, Google Maps link
 *   [ ] preWeddingEvents / program   — mehendi, walima, timeline
 *   [ ] contacts[].phones            — numbers guests can call
 *   [ ] rsvp.whatsapp                — YOUR WhatsApp number (with country code)
 *   [ ] copy.*                       — all the written text
 *   [ ] media.*                      — intro video / poster / music
 *   [ ] theme.*                      — colours (optional)
 *
 * File paths are relative so this works on any static host.
 */

window.INVITATION_CONFIG = {
  // "full" = always play the petals/confetti even if the guest's OS asks
  // for reduced motion. "respect" = honour the OS setting. "reduce" = never.
  motion: "full",

  site: {
    title: "Our Wedding Invitation",
    description:
      "You are warmly invited to celebrate our wedding with us.",
  },

  couple: {
    brideInitial: "A",
    groomInitial: "T",
    groom: {
      name: "Dr. Talha Shahid",
      relation: "Son of",
      parents: "Dr. & Mrs. Shahid Chaudhary",
    },
    bride: {
      name: "Dr. Affifa Bashir",
      relation: "Daughter of",
      parents: "Mr. & Mrs. Bashir Ahmed",
    },
  },

  copy: {
        bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    bismillahTranslation:
      "In the name of Allah, the Most Gracious, the Most Merciful",
    welcomeLine: "With joyful hearts, we invite you\nto the wedding of",
    invitation:
      "",
    heroClosing: "",
    welcomeTitle: "Beautiful Beginning",
    welcomeBody:
      "Two hearts, two families, and one beautiful journey. With gratitude to Allah, we invite you to join us as we celebrate the beginning of our forever.",
    gifts:
      "Your love, blessings, and presence are the greatest gifts we could ever ask for.",
    closing: "We can’t wait to celebrate this special beginning with you.",
    dua: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    duaTranslation:
      "May Allah bless you both, shower His blessings upon you, and join you together in goodness.",
  },

  wedding: {
    // IMPORTANT: use a valid ISO date WITH the local UTC offset
    // (India = +05:30) so the countdown is accurate.
    isoDate: "2026-12-26T13:00:00+05:00",
    date: "December 26, 2026",
    day: "Saturday",
    time: "01:00 PM to 5:00 PM",
    timezone: "PKT",
  },

  media: {
    // Intro film shown on the opening screen + its poster image.
    introVideo: "./assets/media/intro-v2.mp4",
    introPoster: "./assets/media/poster-v2.webp",
    music: "./assets/media/music.mp3",

    // Gallery photos (optional) — add your own image URLs/paths here.
    gallery: [],
  },

  program: [
    {
      time: "6:30 PM",
      title: "Guest Arrival",
      note: "Welcome refreshments",
    },
    {
      time: "07:00 PM",
      title: "Nikah Ceremony",
      note: "Promises shared with family blessings",
    },
    {
      time: "07:30 PM",
      title: "Family Blessings",
      note: "Greetings & photographs",
    },
    {
      time: "08:00 PM",
      title: "Dinner",
      note: "A feast shared with love",
    },
  ],

  venue: {
    name: "Deewan e Khas Event Hall",
    address:
      "13 Gajyani Road, Chishtian",
    mapUrl: "https://maps.app.goo.gl/b5Kgh7GJ6gUaaRZq8?g_st=iw",
  },

dressCode: {
  title: "Festive Formal",
  description:
    "Traditional or formal attire is encouraged. Sarees, lehengas, anarkalis, sherwanis, kurtas, suits, and formal dresses are all welcome. We kindly ask guests to avoid overly casual attire and white or ivory.",
  swatches: [
    "#5D4C3E",
    "#8F917D",
    "#AE845E",
    "#8C6254",
    "#D8C7B5",
  ],
},

  preWeddingEvents: [
    {
      name: "Mehendi",
      date: "December 25, 2026",
      time: "6:00 PM to 10:00 PM",
      location: "Deewan e Khas Event Hall",
      address: "13 Gajyani Road, Chishtian",
      mapLink: "https://maps.app.goo.gl/b5Kgh7GJ6gUaaRZq8?g_st=iw",
    },
    {
      name: "Walima",
      date: "December 26, 2026",
      time: "7:30 PM",
      location: "Deewan e Khas Event Hall",
      address: "13 Gajyani Road, Chishtian",
      mapLink: "https://maps.app.goo.gl/b5Kgh7GJ6gUaaRZq8?g_st=iw",
    },
  ],

  rsvp: {
    deadline: "Kindly respond by April 15, 2027",
    contact: "For assistance, call +91 00000 00000",
    // Your WhatsApp number WITH country code, digits only or with +.
    // Guests' RSVP form opens WhatsApp with a pre-filled message.
    whatsapp: "+91 00000 00000",
    fields: {
      name: "Your full name",
      email: "Email address",
      attendance: ["Joyfully accepts", "Regretfully declines"],
      guests: ["1 guest", "2 guests", "3 guests", "4 guests"],
      note: "Dietary notes or a message for the couple",
    },
  },

  /* ---- extra sections: verse, photo bands, gentle customs, blessings, contacts ---- */
  verse: {
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    translation: "And among His signs is that He created for you spouses from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy.",
    reference: "Surah Ar-Rum · 30:21",
  },

  // Full-width photographs between sections (photos come from media.gallery, in order).
  bands: [
    { quote: "Promised in prayer, sealed with smiles", sub: "The first of many chapters" },
    { quote: "Surrounded by love and duas", sub: "With our families" },
  ],

  etiquette: {
    intro: "A few gentle notes to keep the day comfortable and beautiful for everyone.",
    // icon: dress | clock | silent | crescent | camera | plate | heart | gift
    items: [
      { icon: "dress", title: "Modest attire", text: "We kindly request modest, elegant dress in keeping with the occasion." },
      { icon: "clock", title: "Arrive on time", text: "The Nikah begins promptly. Please be seated a little early so the khutbah is heard in full." },
      { icon: "silent", title: "Phones on silent", text: "Kindly silence your phones during the khutbah and ijab-qubool so the moment is held in stillness." },
      { icon: "crescent", title: "Join in dua", text: "Raise your hands with us when the duas are made. Your prayers are the best gift." },
      { icon: "camera", title: "Photographs with grace", text: "Our photographer will capture the day. Please be mindful of privacy and the ladies’ areas." },
      { icon: "plate", title: "Stay for the feast", text: "Share a meal with the families once the Nikah is done. The day is incomplete without you." },
    ],
  },

  blessings: {
    items: [
      { icon: "crescent", title: "Your Duas", text: "Pray that our home is filled with sakinah, mawaddah and rahmah." },
      { icon: "heart", title: "Your Presence", text: "Having our loved ones beside us is the blessing we cherish most." },
    ],
  },

  // side: "bride" | "groom". Names and parents are taken from the couple block above.
  contacts: [
    { side: "groom", phones: ["+91 00000 00000"] },
    { side: "bride", phones: ["+91 00000 00000"] },
  ],

  theme: {
    ivory: "#FFF5F0",       /* blush white */
    plum: "#4B1631",        /* deep berry */
    lavender: "#F7D5DE",    /* rose blush */
    mauve: "#B83A62",       /* rose pink accent */
    lilac: "#C9A6D9",       /* soft lilac */
    champagne: "#D6A03C",   /* warm gold */
  },
};
