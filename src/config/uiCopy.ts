/** Тексты интерфейса: дефолты + слияние с `/ui.json` */

export interface UiCatalogCopy {
  pageTitle: string;
  pageLead: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  searchClearAria: string;
  categoriesAriaLabel: string;
  filterAll: string;
  catalogListAria: string;
  loadingAria: string;
  emptyNoProducts: string;
  emptySearchNoResults: string;
  pdfModalLoadingAria: string;
  videoModalLoadingAria: string;
}

export interface UiCatalogEmptyCopy {
  search: {
    title: string;
    descriptionWithQuery: string;
    descriptionNoQuery: string;
    primary: string;
  };
  searchInCategory: {
    title: string;
    descriptionWithQuery: string;
    descriptionNoQuery: string;
    primary: string;
    secondary: string;
  };
  category: {
    title: string;
    description: string;
    primary: string;
  };
}

export interface UiProductCardCopy {
  articlePrefix: string;
  materialsAriaLabel: string;
  noMaterials: string;
}

export interface UiFaqCopy {
  sectionTitle: string;
  pageTitle: string;
  loading: string;
  empty: string;
  listAriaLabel: string;
  loadError: string;
}

export interface UiHelpCtaCopy {
  heading: string;
  description: string;
  toggleLabel: string;
  steps: string[];
}

export interface UiCopy {
  catalog: UiCatalogCopy;
  catalogEmpty: UiCatalogEmptyCopy;
  productCard: UiProductCardCopy;
  faq: UiFaqCopy;
  helpCta: UiHelpCtaCopy;
}

export const DEFAULT_UI_COPY: UiCopy = {
  catalog: {
    pageTitle: 'Инструкции',
    pageLead:
      'Найдите товар по названию или артикулу на упаковке – все в одном месте',
    searchPlaceholder: 'Название или артикул',
    searchAriaLabel: 'Поиск по названию или артикулу',
    searchClearAria: 'Очистить поиск',
    categoriesAriaLabel: 'Категории',
    filterAll: 'Все',
    catalogListAria: 'Список товаров',
    loadingAria: 'Загрузка',
    emptyNoProducts: 'Нет товаров',
    emptySearchNoResults: 'Ничего не найдено',
    pdfModalLoadingAria: 'Загрузка просмотрщика',
    videoModalLoadingAria: 'Загрузка плеера',
  },
  catalogEmpty: {
    search: {
      title: 'Ничего не нашлось',
      descriptionWithQuery: 'Попробуйте ввести артикул с упаковки: «{{query}}» не найден',
      descriptionNoQuery: 'Попробуйте ввести артикул с упаковки',
      primary: 'Очистить поиск',
    },
    searchInCategory: {
      title: 'В этой категории нет совпадений',
      descriptionWithQuery:
        'Попробуйте ввести артикул с упаковки: «{{query}}» в выбранной категории не найден. Сбросьте категорию при необходимости.',
      descriptionNoQuery: 'Попробуйте ввести артикул с упаковки или сбросьте категорию.',
      primary: 'Все категории',
      secondary: 'Очистить поиск',
    },
    category: {
      title: 'В этой категории нет товаров',
      description: 'Сбросьте фильтр категории, чтобы увидеть весь список.',
      primary: 'Показать все',
    },
  },
  productCard: {
    articlePrefix: 'Арт.',
    materialsAriaLabel: 'Файлы и ссылки',
    noMaterials: 'Нет прикреплённых материалов.',
  },
  faq: {
    sectionTitle: 'Вопросы и ответы',
    pageTitle: 'Вопросы и ответы',
    loading: 'Загрузка…',
    empty: 'Пока нет вопросов.',
    listAriaLabel: 'Список вопросов',
    loadError: 'Не удалось загрузить частые вопросы',
  },
  helpCta: {
    heading: 'Не нашли ответ?',
    description:
      'Мы всегда на связи и внимательно относимся к каждому обращению. Напишите нам через поддержку Ozon — и мы подключимся к решению.',
    toggleLabel: 'Как это сделать',
    steps: [
      'Откройте приложение или сайт Ozon',
      'Перейдите в «Профиль» → «Заказы»',
      'Выберите нужный заказ',
      'Нажмите «Помощь» или «Связаться с поддержкой»',
      'Опишите ваш вопрос — мы увидим обращение и ответим',
    ],
  },
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergeSection<T extends object>(base: T, patch: unknown): T {
  if (!isRecord(patch)) return { ...base };
  const baseRec = base as Record<string, unknown>;
  const out = { ...baseRec };
  for (const k of Object.keys(baseRec)) {
    if (k in patch) {
      const pv = (patch as Record<string, unknown>)[k];
      const bv = baseRec[k];
      if (Array.isArray(bv) && Array.isArray(pv)) {
        out[k] = pv.length > 0 ? pv : bv;
      } else if (isRecord(bv) && isRecord(pv)) {
        out[k] = mergeSection(bv as object, pv);
      } else if (typeof bv === 'string' && typeof pv === 'string') {
        out[k] = pv;
      } else if (typeof bv === 'number' && typeof pv === 'number') {
        out[k] = pv;
      } else if (typeof bv === 'boolean' && typeof pv === 'boolean') {
        out[k] = pv;
      }
    }
  }
  return out as T;
}

export function mergeUiCopy(raw: unknown): UiCopy {
  if (!isRecord(raw)) return structuredClone(DEFAULT_UI_COPY);
  const ce = isRecord(raw.catalogEmpty) ? raw.catalogEmpty : {};
  const help = isRecord(raw.helpCta) ? raw.helpCta : {};
  const stepsRaw = help.steps;
  const steps =
    Array.isArray(stepsRaw) &&
    stepsRaw.some((s) => typeof s === 'string' && Boolean(String(s).trim()))
      ? (stepsRaw as unknown[]).filter((s): s is string => typeof s === 'string' && Boolean(s.trim()))
      : DEFAULT_UI_COPY.helpCta.steps;

  return {
    catalog: mergeSection(DEFAULT_UI_COPY.catalog as object, raw.catalog) as UiCopy['catalog'],
    catalogEmpty: {
      search: mergeSection(DEFAULT_UI_COPY.catalogEmpty.search as object, ce.search) as UiCatalogEmptyCopy['search'],
      searchInCategory: mergeSection(
        DEFAULT_UI_COPY.catalogEmpty.searchInCategory as object,
        ce.searchInCategory
      ) as UiCatalogEmptyCopy['searchInCategory'],
      category: mergeSection(DEFAULT_UI_COPY.catalogEmpty.category as object, ce.category) as UiCatalogEmptyCopy['category'],
    },
    productCard: mergeSection(DEFAULT_UI_COPY.productCard as object, raw.productCard) as UiCopy['productCard'],
    faq: mergeSection(DEFAULT_UI_COPY.faq as object, raw.faq) as UiCopy['faq'],
    helpCta: {
      heading: typeof help.heading === 'string' ? help.heading : DEFAULT_UI_COPY.helpCta.heading,
      description:
        typeof help.description === 'string' ? help.description : DEFAULT_UI_COPY.helpCta.description,
      toggleLabel:
        typeof help.toggleLabel === 'string' ? help.toggleLabel : DEFAULT_UI_COPY.helpCta.toggleLabel,
      steps,
    },
  };
}

export function applyQueryTemplate(template: string, query: string): string {
  return template.replace(/\{\{query\}\}/g, query);
}
