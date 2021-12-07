import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "i18n";

const { locales } = i18nConfig;

function usePersistLocaleCookie() {
  const { locale, defaultLocale } = useRouter();

  useEffect(persistLocaleCookie, [locale, defaultLocale]);
  function persistLocaleCookie() {
    const cookie = document.cookie;
    const value = `; ${cookie}`;
    const parts = cookie.split("; NEXT_LOCALE=");
    let currentCookieLocale: string | undefined = undefined;
    if (parts.length === 2) {
      let pop = parts.pop();
      if (pop) {
        currentCookieLocale = pop.split(";").shift();
      }
    }
    if (locale !== defaultLocale || locale !== currentCookieLocale) {
      const date = new Date();
      const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
      date.setTime(date.getTime() + expireMs);
      document.cookie = `NEXT_LOCALE=${locale};expires=${date.toUTCString()};path=/`;
    }
  }
}

function LanguageBtn() {
  const { locale, defaultLocale, pathname } = useRouter();
  const { t, lang } = useTranslation("layout");

  usePersistLocaleCookie();

  return locales.map((lng) => {
    if (lang === lng) return null;

    return (
      <Link href={pathname} locale={lng} key={lng}>
        {t(lng)}
      </Link>
    );
  });
}

const Navbar = () => {
  const { t } = useTranslation("layout");

  return (
    <div className="navbar">
      <Link href="/">
        <a className="denso-logo">
          <img src="denso-vector-logo.svg" alt="denso logo"/>
        </a>
      </Link>
      <div className="navbar__link">
        <Link href="/">{t("menu.home")}</Link>
        <Link href="/main">{t("menu.main")}</Link>
        <Link href="/otsm">{t("menu.otsm")}</Link>
      </div>
      <div className="navbar__language">{LanguageBtn()}</div>
    </div>
  );
};

export default Navbar;
