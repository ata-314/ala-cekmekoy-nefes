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
  /** Last frame of the video — the hero card "lands" as this image at the top of the Marka section. */
  videoEndFrame: "/assets/video/videoend.jpg",
} as const;

export const identity = {
  name: "A'lâ Çekmeköy Nefes",
  shortName: "NEFES",
  tagline: "Doğaya yakın. Hayata bağlı.",
  location: "Çekmeköy, İstanbul",
  phone: "444 44 44",
  phoneHref: "tel:4444444",
  email: "info@alacekmekoynefes.com",
  website: "www.alacekmekoynefes.com",
  address: "Ferah, Akçağ Sk. No:26, 34692 Üsküdar/İstanbul",
} as const;

export const seo = {
  title: "A'lâ Çekmeköy Nefes — Doğaya Yakın. Hayata Bağlı.",
  description:
    "Çekmeköy'ün orman dokusunun yanı başında: 14.300 m² arazi üzerinde 9 blok, yalnızca 72 seçkin konut. 3+1 ve 4+1 geniş daireler ile özel bahçeli seçenekler, lansmana özel fiyat ve ödeme avantajlarıyla.",
} as const;

/** Menu items jump to anchored sections below the hero experience. */
export const nav = {
  items: [
    { label: "Marka", anchor: "marka" },
    { label: "Yaşam", anchor: "yasam" },
    { label: "Galeri", anchor: "galeri" },
    { label: "Konum", anchor: "konum" },
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
    {
      value: "14.300 m²",
      label: "Arazi",
      desc: "Çekmeköy'ün orman dokusunun yanı başında, geniş peyzajlı yerleşim alanı.",
    },
    {
      value: "9",
      label: "Blok",
      desc: "Butik ölçekli yerleşim; daha ferah bir site yaşamı, daha fazla mahremiyet.",
    },
    {
      value: "72",
      label: "Seçkin Konut",
      desc: "Kalabalık projelerin yoğunluğundan ayrışan, daha seçici bir yaşam çevresi.",
    },
    {
      value: "197–333 m²",
      label: "Brüt Daire",
      desc: "Günlük hayat düşünülerek planlanmış geniş 3+1 ve 4+1 seçenekleri.",
    },
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

/* ---------- Lower sections (below the hero experience) ---------- */

export const brand = {
  eyebrow: "Marka Hakkında",
  mediaAlt:
    "A'lâ Çekmeköy Nefes yerleşkesi — havuz ve bloklarıyla gün batımında genel görünüm",
  heading: "Seçkin bir yaşam anlayışı,\nÇekmeköy'ün nefesiyle.",
  paragraphs: [
    "A'lâ Çekmeköy Nefes; şehir hayatının temposundan uzaklaşmadan, daha sakin, daha güvenli ve daha iyi hissettiren bir yaşam arayan aileler için hayata geçiriliyor.",
    "Proje adındaki \"A'lâ\", seçkin, özenli ve nitelikli bir yaşam anlayışını temsil eder. \"Nefes\" ise Çekmeköy'ün yeşil dokusu içinde ferahlığı, huzuru ve eve dönüldüğünde hissedilen iç rahatlığını anlatır.",
    "9 blok ve 72 daireden oluşan butik yapısıyla proje; geniş 3+1 ve 4+1 daireleri, bahçe ve teras kullanımlarıyla ailelere villa hayatına alternatif olabilecek ferah, mahremiyetli ve konforlu bir yaşam deneyimi kazandırır.",
  ],
} as const;

export const whyCekmekoy = {
  eyebrow: "Neden Çekmeköy?",
  heading: "İstanbul'un yeni premium yaşam aksında.",
  items: [
    "Güçlü özel okul ve eğitim altyapısı",
    "Ormanlar ve doğal yaşam alanları",
    "Spor ve açık hava olanakları",
    "Gelişen premium konut çevresi",
    "Aile yaşamına uygun sosyal yapı",
    "İstanbul'un ana ulaşım ağlarına bağlantı",
  ],
} as const;

export const editorial = {
  eyebrow: "Yaşam",
  heading: "Nefes'te hayat,\nkapınızda bitmiyor.",
  rows: [
    {
      image: gallery.items[4],
      title: "Doğayı seyretmek değil, yaşamak",
      body: "Geniş balkonlar ve teraslar, peyzajla bütünleşen yaşam alanları ve özel bahçeli konutlar farklı yaşam tercihlerine cevap veriyor. Bazı bahçeli evlerde yüzlerce metrekarelik eve özel açık alanlar bulunuyor — açık alan evinizin manzarası değil, devamı.",
    },
    {
      image: gallery.items[6],
      title: "Büyük ev değil, doğru ev",
      body: "197 m²'den 333 m²'nin üzerine uzanan 3+1 ve 4+1 daireler; geniş salonlar, büyük ebeveyn yatak odaları, giyinme ve çalışma odaları, işlik çözümleri ve her konuta özel 4–8 m² depo ile günlük hayat düşünülerek planlandı.",
    },
    {
      image: gallery.items[7],
      title: "Çocuklar için iyi bir büyüme çevresi",
      body: "Çekmeköy'ün güçlü eğitim altyapısı; doğa, düşük yoğunluklu site yaşamı, geniş evler ve açık alanlarla aynı çevrede buluşuyor. Okula yakın, ormana komşu, çocuklu hayata Nefes.",
    },
  ],
} as const;

export const galleryBelow = {
  eyebrow: "Galeri",
  heading: "Projeyi yakından görün.",
} as const;

export const location = {
  eyebrow: "Konum",
  heading: "Çekmeköy'de, tam\nolması gereken yerde.",
  body: "Proje, Lens Çekmeköy'ün hemen arkasında, Şile Otoyolu'nun hemen üzerinde konumlanıyor; ana yol bağlantısı yaklaşık 15–20 metre mesafede. Bir tarafta Çekmeköy'ün orman dokusu, diğer tarafta şehrin ulaşım ve günlük yaşam olanakları.",
  mapImage: "/assets/map/konum.jpg",
  mapAlt:
    "A'lâ Çekmeköy Nefes konum haritası — Lens Çekmeköy, Şile Otoyolu, Parseller Metro, Yenidoğu Okulları, Medistate Hastanesi, Metrogarden ve Buyaka AVM",
  pois: [
    { name: "Lens Çekmeköy", detail: "Hemen arkasında — market, kafe ve restoranlar" },
    { name: "Şile Otoyolu (D.016)", detail: "Ana yol bağlantısı yaklaşık 15–20 m" },
    { name: "Yenidoğu Okulları", detail: "Nitelikli eğitim yanı başınızda" },
    { name: "Parseller Metro", detail: "Metroyla İstanbul'a bağlantı" },
    { name: "Medistate Hastanesi", detail: "Sağlık olanakları yakın çevrede" },
    { name: "Metrogarden & Buyaka AVM", detail: "Alışveriş ve sosyal yaşam" },
    { name: "Kuzey Marmara Otoyolu (E-80)", detail: "Şehir dışına hızlı erişim" },
  ],
} as const;

export const finalCta = {
  eyebrow: "Lansmana Özel",
  heading: "Nefes'te yerinizi lansman\navantajlarıyla alın.",
  body: "Özel fiyat ve ödeme avantajları, farklı daire ve sınırlı sayıdaki bahçeli konut alternatifleri için satış ekibimizle tanışın.",
  cta: "Lansman Fırsatlarını Öğrenin",
} as const;

export const footer = {
  legal: "© 2026 A'lâ Çekmeköy Nefes. Tüm hakları saklıdır.",
  kvkkLabel: "KVKK Aydınlatma Metni",
} as const;

export type GalleryItem = (typeof gallery.items)[number];
export type AdvantageItem = (typeof advantages.items)[number];
