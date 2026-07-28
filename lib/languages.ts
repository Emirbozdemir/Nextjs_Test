export const languages = {
  en: { name: "English", locale: "en", direction: "ltr" },
  tr: { name: "Türkçe", locale: "tr", direction: "ltr" },
  ar: { name: "العربية", locale: "ar", direction: "rtl" },
  fr: { name: "Français", locale: "fr", direction: "ltr" },
  ru: { name: "Русский", locale: "ru", direction: "ltr" },
} as const;

export type LanguageCode = keyof typeof languages;

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: { dashboard: "Dashboard", users: "Users", products: "Products", orders: "Orders", analytics: "Analytics", settings: "Settings", managementSystem: "Management System", administrator: "Administrator" },
  tr: { dashboard: "Kontrol Paneli", users: "Kullanıcılar", products: "Ürünler", orders: "Siparişler", analytics: "Analitik", settings: "Ayarlar", managementSystem: "Yönetim Sistemi", administrator: "Yönetici" },
  ar: { dashboard: "لوحة التحكم", users: "المستخدمون", products: "المنتجات", orders: "الطلبات", analytics: "التحليلات", settings: "الإعدادات", managementSystem: "نظام الإدارة", administrator: "المسؤول" },
  fr: { dashboard: "Tableau de bord", users: "Utilisateurs", products: "Produits", orders: "Commandes", analytics: "Analyses", settings: "Paramètres", managementSystem: "Système de gestion", administrator: "Administrateur" },
  ru: { dashboard: "Панель управления", users: "Пользователи", products: "Товары", orders: "Заказы", analytics: "Аналитика", settings: "Настройки", managementSystem: "Система управления", administrator: "Администратор" },
};
