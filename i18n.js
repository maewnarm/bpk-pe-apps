module.exports = {
  locales: ["en", "th"],
  defaultLocale: "en",
  pages: {
    "*": ["layout"]
  },
  loadLocaleFrom: (lang, ns) => import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
}