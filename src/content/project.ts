/**
 * ALA ÇEKMEKÖY NEFES — single edit point for all copy, data and asset paths.
 *
 * Copy distilled from the human-provided content guide
 * ("AÇN Landing Page İçerik Rehberi KB", 2026-08-20 — archived in the agent's
 * data/imports). Facts (land size, block/unit counts, m² range, location,
 * tech specs) come from that document; nothing is invented.
 */

export const assets = {
  /** White on-dark logo (public/assets/logo/logo.png). */
  logo: "/assets/logo/logo.png",
  /** Scroll-scrubbed promo video, 1600w, dense keyframes (g=8). */
  heroVideo: "/assets/video/hero.mp4",
  /** Lightweight 960w loop served to touch devices instead of the scrub file. */
  heroVideoMobile: "/assets/video/hero-mobile.mp4",
  /** First frame of the video; also the reduced-motion background. */
  heroPoster: "/assets/video/poster.jpg",
} as const;

export const identity = {
  name: "ALA ÇEKMEKÖY NEFES",
  shortName: "NEFES",
  tagline: "Doğaya yakın. Hayata bağlı.",
  location: "Çekmeköy, İstanbul",
  /** Shown as a static badge in the header. */
  headerBadge: "Lansmana Özel Fırsatlar",
} as const;

export const seo = {
  title: "ALA Çekmeköy Nefes — Doğaya Yakın. Hayata Bağlı.",
  description:
    "Çekmeköy'ün orman dokusunun yanı başında: 14.300 m² arazi üzerinde 9 blok, yalnızca 72 seçkin konut. 3+1 ve 4+1 geniş daireler ile özel bahçeli seçenekler, lansmana özel fiyat ve ödeme avantajlarıyla.",
} as const;

/** Menu items scroll to a fraction of the experience (same mapping works for the reduced-motion layout). */
export const nav = {
  items: [
    { label: "Proje", progress: 0.25 },
    { label: "Avantajlar", progress: 0.5 },
    { label: "Galeri", progress: 0.78 },
  ],
  contact: "Bilgi Al",
} as const;

export const intro = {
  eyebrow: "Çekmeköy · İstanbul",
  heading: "Doğaya yakın.\nHayata bağlı.",
  sub: "Kaydırın, projeyi keşfedin.",
} as const;

export const info = {
  eyebrow: "Proje Bilgileri",
  heading: "Daha az yoğunluk.\nDaha fazla Nefes.",
  body: "Ala Çekmeköy Nefes, Çekmeköy'ün orman dokusunun yanı başında, 14.300 m² arazi üzerinde yalnızca 72 konutluk düşük yoğunluklu bir yerleşim sunuyor: daha ferah bir site yaşamı, daha fazla mahremiyet, daha geniş peyzaj.",
  stats: [
    { value: "14.300 m²", label: "Arazi" },
    { value: "9", label: "Blok" },
    { value: "72", label: "Seçkin Konut" },
    { value: "197–333 m²", label: "Brüt Daire" },
  ],
} as const;

export const advantages = {
  eyebrow: "Neden Ala Çekmeköy Nefes?",
  heading: "Şehre bağlı,\ndoğayla iç içe.",
  items: [
    {
      icon: "/assets/icons/nature.svg",
      title: "Orman Dokusuna Komşu",
      body: "Bir yanda Çekmeköy'ün ormanı ve doğal yaşamı, diğer yanda şehrin ulaşım ve günlük yaşam olanakları.",
    },
    {
      icon: "/assets/icons/location.svg",
      title: "Güçlü Mikro Lokasyon",
      body: "Lens Çekmeköy'ün hemen arkasında; Şile Otoyolu bağlantısına birkaç adım, marketler ve kafeler yanı başınızda.",
    },
    {
      icon: "/assets/icons/plan.svg",
      title: "Geniş ve Doğru Planlar",
      body: "3+1 ve 4+1 daireler; geniş salonlar, ebeveyn alanları, işlik çözümleri ve her konuta özel 4–8 m² depo.",
    },
    {
      icon: "/assets/icons/comfort.svg",
      title: "Geleceğe Hazır Konfor",
      body: "Akıllı ev sistemi, yerden ısıtma, VRV iklimlendirme ve her konutun park alanında özel elektrikli araç şarjı.",
    },
  ],
} as const;

export const gallery = {
  eyebrow: "Galeri",
  heading: "Nefes'ten kareler.",
  items: [
    { src: "/assets/gallery/01.jpg", alt: "Ala Çekmeköy Nefes site girişi ve karşılama alanı" },
    { src: "/assets/gallery/02.jpg", alt: "14.300 m² arazi üzerinde 9 bloklu yerleşimin havadan görünümü" },
    { src: "/assets/gallery/03.jpg", alt: "Gün batımında havuz ve blokların görünümü" },
    { src: "/assets/gallery/04.jpg", alt: "Havuz boyunca uzanan blok cephesi" },
    { src: "/assets/gallery/05.jpg", alt: "Peyzajla bütünleşen bahçe yaşamı" },
    { src: "/assets/gallery/06.jpg", alt: "Geniş teraslarda aile yaşamı" },
    { src: "/assets/gallery/07.jpg", alt: "Ferah salon ve iç mekân tasarımı" },
    { src: "/assets/gallery/08.jpg", alt: "Site içi spor ve aktivite alanları" },
    { src: "/assets/gallery/09.jpg", alt: "Özel bahçeli konut terası" },
  ],
} as const;

export const closing = {
  eyebrow: "Lansmana Özel",
  heading: "Nefes'te yerinizi\nşimdi ayırın.",
  body: "Lansmana özel fiyat ve ödeme avantajlarıyla; 3+1, 4+1 ve sınırlı sayıdaki özel bahçeli konut seçeneklerini birlikte belirleyelim.",
  cta: "Lansman Fırsatlarını Öğrenin",
} as const;

export const form = {
  title: "Bilgi Alın",
  sub: "Formu doldurun, lansman fırsatlarını ilk siz öğrenin.",
  fields: {
    name: { label: "Ad Soyad", placeholder: "Adınız Soyadınız" },
    phone: { label: "Telefon", placeholder: "05__ ___ __ __" },
    email: { label: "E-posta", placeholder: "ornek@eposta.com" },
    unitType: { label: "İlgilendiğiniz Konut Tipi", placeholder: "Seçiniz" },
  },
  unitTypes: ["3+1", "4+1", "Özel Bahçeli Konut"],
  kvkk: {
    label:
      "KVKK Aydınlatma Metni'ni okudum; kişisel verilerimin proje hakkında bilgilendirme amacıyla işlenmesine onay veriyorum.",
    linkText: "KVKK Aydınlatma Metni",
    /** Point to the real KVKK page/PDF when provided. */
    href: "#kvkk",
  },
  submit: "Bilgi Al",
  privacyNote: "Bilgileriniz gizli tutulur; yalnızca sizinle iletişim kurmak için kullanılır.",
  success: {
    title: "Talebiniz alındı.",
    body: "Satış ekibimiz en kısa sürede sizinle iletişime geçecek.",
  },
  errors: {
    name: "Lütfen adınızı ve soyadınızı girin.",
    phone: "Lütfen geçerli bir telefon numarası girin.",
    email: "Lütfen geçerli bir e-posta adresi girin.",
    unitType: "Lütfen bir konut tipi seçin.",
    kvkk: "Devam etmek için KVKK onayı gereklidir.",
  },
} as const;

export type GalleryItem = (typeof gallery.items)[number];
export type AdvantageItem = (typeof advantages.items)[number];
