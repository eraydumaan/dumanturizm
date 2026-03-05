const links = document.querySelectorAll(".nav a");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!link.getAttribute("href").startsWith("#")) return;
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    // Mobilde menüyü kapat
    document.querySelector(".nav").classList.remove("active");
    document.querySelector(".hamburger").classList.remove("active");
  });
});

// Hamburger Menü
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });
}

// Menü dışına tıklayınca kapat
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav") && !e.target.closest(".hamburger")) {
    if (nav) nav.classList.remove("active");
    if (hamburger) hamburger.classList.remove("active");
  }
});

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.");
    form.reset();
  });
}

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tab;
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    const panel = document.getElementById(targetId);
    if (panel) {
      panel.classList.add("active");
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Fiyat Hesaplama
const calcBtn = document.getElementById("calc-price");
const resultPrice = document.getElementById("result-price");

// Mesafe matrisi (basit tahmini km değerleri)
const distances = {
  bahcesehir: { maslak: 35, levent: 32, mecidiyekoy: 30, sisli: 28, taksim: 30, kadikoy: 55, atasehir: 50, umraniye: 45, gebze: 80, dudullu: 40 },
  esenyurt: { maslak: 40, levent: 38, mecidiyekoy: 35, sisli: 33, taksim: 35, kadikoy: 60, atasehir: 55, umraniye: 50, gebze: 85, dudullu: 45 },
  avcilar: { maslak: 30, levent: 28, mecidiyekoy: 25, sisli: 23, taksim: 25, kadikoy: 45, atasehir: 40, umraniye: 35, gebze: 70, dudullu: 35 },
  beylikduzu: { maslak: 45, levent: 42, mecidiyekoy: 40, sisli: 38, taksim: 40, kadikoy: 65, atasehir: 60, umraniye: 55, gebze: 90, dudullu: 50 },
  kadikoy: { maslak: 25, levent: 22, mecidiyekoy: 20, sisli: 18, taksim: 15, kadikoy: 5, atasehir: 12, umraniye: 18, gebze: 45, dudullu: 20 },
  atasehir: { maslak: 20, levent: 18, mecidiyekoy: 18, sisli: 20, taksim: 22, kadikoy: 12, atasehir: 5, umraniye: 10, gebze: 40, dudullu: 8 },
  umraniye: { maslak: 18, levent: 16, mecidiyekoy: 20, sisli: 22, taksim: 25, kadikoy: 18, atasehir: 10, umraniye: 5, gebze: 35, dudullu: 5 },
  pendik: { maslak: 45, levent: 42, mecidiyekoy: 45, sisli: 47, taksim: 50, kadikoy: 25, atasehir: 20, umraniye: 18, gebze: 15, dudullu: 22 },
  tuzla: { maslak: 55, levent: 52, mecidiyekoy: 55, sisli: 57, taksim: 60, kadikoy: 35, atasehir: 30, umraniye: 28, gebze: 10, dudullu: 30 },
  kartal: { maslak: 35, levent: 32, mecidiyekoy: 35, sisli: 37, taksim: 40, kadikoy: 15, atasehir: 12, umraniye: 15, gebze: 25, dudullu: 18 }
};

// Fiyat hesaplama fonksiyonu
function calculatePrice(from, to, personCount, serviceType) {
  const dist = distances[from]?.[to] || 30; // Varsayılan 30 km
  
  // Temel birim fiyatlar (TL/km)
  let baseRate = 8; // Günlük
  let multiplier = 1;
  
  if (serviceType === "monthly") {
    multiplier = 22; // Aylık gün sayısı
    baseRate = 6; // Aylık indirimli
  } else if (serviceType === "school") {
    multiplier = 20; // Okul günleri
    baseRate = 5.5; // Okul indirimi
  }
  
  // Kişi sayısına göre araç tipi
  let vehicleCost = 0;
  if (personCount <= 8) {
    vehicleCost = 150; // Minivan
  } else if (personCount <= 16) {
    vehicleCost = 250; // Minibüs
  } else if (personCount <= 30) {
    vehicleCost = 400; // Midibüs
  } else {
    vehicleCost = 600; // Otobüs
  }
  
  const basePrice = (dist * baseRate + vehicleCost) * multiplier;
  
  // Yuvarlama (50'ye yuvarla)
  return Math.round(basePrice / 50) * 50;
}

if (calcBtn) {
  calcBtn.addEventListener("click", () => {
    const from = document.getElementById("from-location").value;
    const to = document.getElementById("to-location").value;
    const personCount = parseInt(document.getElementById("person-count").value) || 10;
    const serviceType = document.getElementById("service-type").value;
    
    if (!from || !to) {
      resultPrice.textContent = "Lütfen bölge seçin";
      return;
    }
    
    const price = calculatePrice(from, to, personCount, serviceType);
    
    // Animasyonlu sayı gösterimi
    let current = 0;
    const step = Math.ceil(price / 20);
    const interval = setInterval(() => {
      current += step;
      if (current >= price) {
        current = price;
        clearInterval(interval);
      }
      resultPrice.textContent = current.toLocaleString("tr-TR") + " ₺";
    }, 30);
  });
}

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

// Kayıtlı temayı kontrol et
function getStoredTheme() {
  return localStorage.getItem("theme");
}

// Temayı uygula
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// Başlangıç teması
const storedTheme = getStoredTheme();
if (storedTheme) {
  applyTheme(storedTheme);
} else if (prefersDark.matches) {
  applyTheme("dark");
}

// Toggle butonu
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

// Sistem tercihi değişirse
prefersDark.addEventListener("change", (e) => {
  if (!getStoredTheme()) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  
  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    
    // Diğer tüm açık olanları kapat
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
    });
    
    // Tıklanan öğeyi aç/kapat
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// Google Maps - Canlı Araç Takibi
let map;
let markers = [];

// Araç konumları (demo veriler)
const vehicleLocations = [
  { id: 1, name: "Servis 01 - Maslak Hattı", lat: 41.1082, lng: 29.0276, status: "Yolda" },
  { id: 2, name: "Servis 02 - Bahçeşehir", lat: 41.0550, lng: 28.6787, status: "Yolda" },
  { id: 3, name: "Servis 03 - Kadıköy", lat: 40.9923, lng: 29.0247, status: "Yolda" },
  { id: 4, name: "Servis 04 - Ümraniye", lat: 41.0422, lng: 29.0910, status: "Durakta" }
];

function initMap() {
  const mapElement = document.getElementById("live-map");
  if (!mapElement) return;

  // İstanbul merkezi
  const istanbul = { lat: 41.0082, lng: 28.9784 };
  
  map = new google.maps.Map(mapElement, {
    zoom: 11,
    center: istanbul,
    styles: getMapStyles(),
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  // Araç markerlarını ekle
  vehicleLocations.forEach((vehicle) => {
    const marker = new google.maps.Marker({
      position: { lat: vehicle.lat, lng: vehicle.lng },
      map: map,
      title: vehicle.name,
      icon: {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23c3753b' stroke='white' stroke-width='3'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='18'%3E🚐%3C/text%3E%3C/svg%3E",
        scaledSize: new google.maps.Size(40, 40)
      },
      animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding:8px;font-family:Manrope,sans-serif;">
        <strong>${vehicle.name}</strong><br>
        <span style="color:#6b6258;">${vehicle.status}</span>
      </div>`
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    markers.push({ marker, vehicle });
  });

  // Araç listesi tıklama
  const vehicleItems = document.querySelectorAll(".vehicle-item");
  vehicleItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      vehicleItems.forEach((v) => v.classList.remove("active"));
      item.classList.add("active");
      
      if (markers[index]) {
        const { marker } = markers[index];
        map.panTo(marker.getPosition());
        map.setZoom(14);
        google.maps.event.trigger(marker, "click");
      }
    });
  });
}

// Harita stilleri (tema uyumlu)
function getMapStyles() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  
  if (isDark) {
    return [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
    ];
  }
  
  return [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "simplified" }] }
  ];
}

// Tema değiştiğinde haritayı güncelle
const observer = new MutationObserver(() => {
  if (map) {
    map.setOptions({ styles: getMapStyles() });
  }
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

// Google Maps yüklendiğinde çalıştır
window.initMap = initMap;
