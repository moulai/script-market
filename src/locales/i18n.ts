import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zh from './zh';
import en from './en';

// 初始化i18n
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources: {
      zh: {
        translation: zh,
      },
      en: {
        translation: en,
      },
    },
    fallbackLng: 'zh', // 默认语言
    debug: process.env.NODE_ENV === 'development', // 开发环境下启用调试
    interpolation: {
      escapeValue: false, // 不转义特殊字符
    },
  });

export default i18n; 