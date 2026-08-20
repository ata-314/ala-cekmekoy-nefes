/**
 * ALA ÇEKMEKÖY NEFES — single edit point for all copy, data and asset paths.
 *
 * PLACEHOLDER NOTICE: every value marked with [PLACEHOLDER] is invented layout
 * copy and MUST be replaced with real project facts before any publish.
 * Asset paths point into /public/assets/** — see README.md for what to drop where.
 */

export const assets = {
  /** Light (on-dark) logo. Drop the real file at public/assets/logo/logo.svg (or .png). */
  logo: "/assets/logo/logo.svg",
  /** Scroll-scrubbed promo video. Drop at public/assets/video/hero.mp4 (see README encoding notes). */
  heroVideo: "/assets/video/hero.mp4",
  /** First-frame poster shown before the video loads. public/assets/video/poster.jpg */
  heroPoster: "/assets/video/poster.jpg",
} as const;

export const identity = {
  name: "ALA ÇEKMEKÖY NEFES",
  shortName: "NEFES",
  tagline: "Şehrin içinde, nefesin yanında.", // [PLACEHOLDER]
  location: "Çekmeköy, İstanbul",
  phone: "+90 216 000 00 00", // [PLACEHOLDER]
  phoneDisplay: "0216 000 00 00", // [PLACEHOLDER]
} as const;

export const seo = {
  title: "ALA Çekmeköy Nefes — Çekmeköy'de Yeni Bir Yaşam",
  description:
    "ALA Çekmeköy Nefes: Çekmeköy'ün yeşiliyle iç içe, ferah ve modern bir yaşam projesi. Konut tipleri, avantajlar ve proje detayları için bilgi alın.", // [PLACEHOLDER]
} as const;

export const intro = {
  eyebrow: "Çekmeköy · İstanbul",
  heading: "Nefes almanın\nyeni adresi.", // [PLACEHOLDER] — \n = line break
  sub: "Kaydırın, projeyi keşfedin.",
} as const;

export const info = {
  eyebrow: "Proje Bilgileri",
  heading: "Doğayla kurulan\nyeni bir denge.", // [PLACEHOLDER]
  body: "ALA Çekmeköy Nefes, Çekmeköy'ün yeşil dokusunun içinde, ferah plan tipleri ve sakin bir yaşam ritmi sunmak üzere tasarlandı.", // [PLACEHOLDER]
  stats: [
    { value: "—", label: "Konut" }, // [PLACEHOLDER — real unit count]
    { value: "—", label: "Blok" }, // [PLACEHOLDER]
    { value: "—", label: "m² Yeşil Alan" }, // [PLACEHOLDER]
    { value: "—", label: "Teslim" }, // [PLACEHOLDER — delivery date]
  ],
} as const;

export const advantages = {
  eyebrow: "Avantajlar",
  heading: "Hayatı kolaylaştıran\ndetaylar.", // [PLACEHOLDER]
  items: [
    {
      icon: "/assets/icons/nature.svg",
      title: "Yeşille İç İçe", // [PLACEHOLDER]
      body: "Ormana komşu konumuyla her sabah temiz havayla uyanın.", // [PLACEHOLDER]
    },
    {
      icon: "/assets/icons/location.svg",
      title: "Merkezi Konum", // [PLACEHOLDER]
      body: "Ana arterlere ve metroya dakikalar içinde ulaşım.", // [PLACEHOLDER]
    },
    {
      icon: "/assets/icons/family.svg",
      title: "Aile Odaklı Yaşam", // [PLACEHOLDER]
      body: "Çocuk oyun alanları, yürüyüş parkurları ve sosyal tesisler.", // [PLACEHOLDER]
    },
    {
      icon: "/assets/icons/security.svg",
      title: "7/24 Güvenlik", // [PLACEHOLDER]
      body: "Kapalı otopark, akıllı site yönetimi ve kesintisiz güvenlik.", // [PLACEHOLDER]
    },
  ],
} as const;

export const gallery = {
  eyebrow: "Galeri",
  heading: "Projeden kareler.", // [PLACEHOLDER]
  /** Drop images at public/assets/gallery/ with these exact names (see README). */
  items: [
    { src: "/assets/gallery/01.jpg", alt: "ALA Çekmeköy Nefes dış cephe görünümü" },
    { src: "/assets/gallery/02.jpg", alt: "Peyzaj ve yeşil alan görünümü" },
    { src: "/assets/gallery/03.jpg", alt: "Örnek daire iç mekân görünümü" },
    { src: "/assets/gallery/04.jpg", alt: "Sosyal tesis görünümü" },
  ],
} as const;

export const closing = {
  eyebrow: "ALA Çekmeköy Nefes",
  heading: "Yerinizi şimdi ayırın.", // [PLACEHOLDER]
  body: "Lansmana özel fırsatlar için formu doldurun, satış ekibimiz sizi arasın.", // [PLACEHOLDER]
  cta: "Bilgi Al",
} as const;

export const form = {
  title: "Bilgi Alın",
  sub: "Formu doldurun, sizi arayalım.",
  fields: {
    name: { label: "Ad Soyad", placeholder: "Adınız Soyadınız" },
    phone: { label: "Telefon", placeholder: "05__ ___ __ __" },
    email: { label: "E-posta", placeholder: "ornek@eposta.com" },
    unitType: { label: "İlgilendiğiniz Konut Tipi", placeholder: "Seçiniz" },
  },
  unitTypes: ["1+1", "2+1", "3+1", "4+1"], // [PLACEHOLDER — real unit mix]
  kvkk: {
    label:
      "KVKK Aydınlatma Metni'ni okudum; kişisel verilerimin proje hakkında bilgilendirme amacıyla işlenmesine onay veriyorum.",
    linkText: "KVKK Aydınlatma Metni",
    /** Point to the real KVKK page/PDF when provided. */
    href: "#kvkk",
  },
  submit: "Bilgi Al",
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
