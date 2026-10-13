/*
  ПРАЙС TEHVIC-SERVICE — единственное место, где хранятся цены.
  Таблицы на всех страницах (и RU, и RO) строятся из этого файла.

  Формат строки:
    { ru: "Название", ro: "Denumire", mid: 250, hard: 300, from: true }
      mid  — цена «Средняя сложность» (лей)
      hard — цена «Сложно» (лей); если нет — услуга с одной ценой
      from — true, если в прайсе написано «от» (для hard — fromHard)
      note — пометка, видна только в коде (для сверки с клиентом)

  Источник: «Lista serviciilor prestate de TEHVIC-SERVICE SRL» от 07.02.2026.
*/
window.TEHVIC_PRICES = {
  laptop: {
    ru: "Ноутбуки", ro: "Laptopuri",
    items: [
      { ru: "Диагностика ноутбука", ro: "Diagnosticare laptop", mid: 250 },
      { ru: "Профилактика: чистка, замена термопасты", ro: "Profilaxie laptop: curățare, pastă termică", mid: 450, hard: 700, fromHard: true },
      { ru: "Ремонт материнской платы", ro: "Reparație placă de bază laptop", mid: 800, hard: 1100, fromHard: true },
      { ru: "Восстановление чипсета / видеочипа / процессора", ro: "Reparație chipset / VGA / CPU laptop", mid: 600, from: true },
      { ru: "Замена клавиатуры", ro: "Schimbare tastatură laptop", mid: 250, hard: 550, fromHard: true },
      { ru: "Замена матрицы (экрана)", ro: "Schimbare display laptop", mid: 400, hard: 600, fromHard: true },
      { ru: "Замена HDD / SSD / привода / RAM / Wi‑Fi / батареи", ro: "Schimbare HDD / SSD / ODD / RAM / Wi‑Fi / baterie", mid: 200, hard: 300, fromHard: true },
      { ru: "Замена крышек корпуса", ro: "Schimbare carcasă laptop", mid: 400, hard: 600, fromHard: true },
      { ru: "Ремонт креплений и петель", ro: "Reparație carcasă / balamale", mid: 500, from: true },
      { ru: "Замена разъёма питания", ro: "Reparație conector alimentare laptop", mid: 450, hard: 600, fromHard: true },
      { ru: "Замена разъёма USB / аудио", ro: "Reparație conector USB / audio", mid: 400, from: true }
    ]
  },

  pc: {
    ru: "Компьютеры", ro: "Calculatoare",
    items: [
      { ru: "Диагностика компьютера", ro: "Diagnosticare PC", mid: 200 },
      { ru: "Профилактика: чистка, замена термопасты", ro: "Profilaxie PC: curățare, pastă termică", mid: 250, hard: 300, fromHard: true },
      { ru: "Сборка / пересборка компьютера", ro: "Asamblare / reasamblare PC", mid: 400, hard: 700, fromHard: true },
      { ru: "Замена комплектующих", ro: "Schimbare componente PC", mid: 100, from: true },
      { ru: "Ремонт кнопки включения / передней панели", ro: "Reparație buton pornire / panou frontal", mid: 200, from: true },
      { ru: "Диагностика материнской платы", ro: "Diagnosticare placă de bază PC", mid: 150 },
      { ru: "Ремонт материнской платы", ro: "Reparație placă de bază PC", mid: 300, from: true },
      { ru: "Прошивка BIOS", ro: "Instalare firmware BIOS", mid: 250, hard: 400, fromHard: true },
      { ru: "Сброс / настройка BIOS", ro: "Resetare / configurare BIOS", mid: 200 },
      { ru: "Диагностика блока питания", ro: "Diagnosticare bloc de alimentare PC", mid: 100 },
      { ru: "Ремонт блока питания", ro: "Reparație bloc de alimentare PC", mid: 200, hard: 400, fromHard: true }
    ]
  },

  apple: {
    ru: "iMac и MacBook", ro: "iMac și MacBook",
    items: [
      { ru: "Диагностика iMac / MacBook", ro: "Diagnosticare iMac / MacBook", mid: 250 },
      { ru: "Профилактика iMac / MacBook", ro: "Profilaxie iMac / MacBook", mid: 500, from: true },
      { ru: "Восстановление macOS", ro: "Restabilire macOS", mid: 450 }
    ]
  },

  parts: {
    ru: "Видеокарты и память", ro: "Plăci video și memorie",
    items: [
      { ru: "Диагностика видеокарты", ro: "Diagnosticare placă video", mid: 100 },
      { ru: "Профилактика видеокарты", ro: "Profilaxie placă video", mid: 300, from: true },
      { ru: "Ремонт видеокарты", ro: "Reparație placă video", mid: 300, hard: 600, fromHard: true },
      { ru: "Диагностика оперативной памяти", ro: "Diagnosticare RAM", mid: 100, note: "RO-прайс: 50 — уточнить" },
      { ru: "Ремонт оперативной памяти", ro: "Reparație RAM", mid: 200, from: true }
    ]
  },

  data: {
    ru: "Диски и данные", ro: "Discuri și date",
    items: [
      { ru: "Диагностика HDD / SSD / флешки", ro: "Diagnosticare HDD / SSD / USB", mid: 100 },
      { ru: "Ремонт HDD / флешки", ro: "Reparație HDD / USB", mid: 300, from: true },
      { ru: "Копирование информации", ro: "Copierea informației", mid: 200, from: true },
      { ru: "Восстановление данных", ro: "Restabilire date HDD / SSD / USB", mid: 500, from: true },
      { ru: "Клонирование диска", ro: "Clonare disc", mid: 300, hard: 500 }
    ]
  },

  software: {
    ru: "Программы и система", ro: "Programe și sistem",
    items: [
      { ru: "Восстановление работы Windows", ro: "Restabilire OS Windows", mid: 350, note: "RO-прайс: 300 — уточнить" },
      { ru: "Восстановление работы Linux", ro: "Restabilire OS Linux", mid: 350, note: "RO-прайс: 300 — уточнить" },
      { ru: "Удаление вирусов", ro: "Devirusare", mid: 200, from: true, note: "RO-прайс: 200 без «от» — уточнить" },
      { ru: "Установка программ по списку клиента", ro: "Instalare soft", mid: 100, hard: 200, fromHard: true },
      { ru: "Форматирование и разметка дисков", ro: "Repartiționare HDD / SSD", mid: 150, from: true }
    ]
  },

  server: {
    ru: "Серверы", ro: "Servere",
    items: [
      { ru: "Диагностика сервера", ro: "Diagnosticare server", mid: 300 },
      { ru: "Восстановление работы ОС сервера", ro: "Restabilire OS server", mid: 1400, hard: 2100 },
      { ru: "Профилактика сервера", ro: "Profilaxie server", mid: 500, hard: 800 },
      { ru: "Восстановление RAID-массива (rebuild)", ro: "Rebuild RAID server", mid: 400, hard: 600, fromHard: true }
    ]
  },

  display: {
    ru: "Мониторы и телевизоры", ro: "Monitoare și televizoare",
    items: [
      { ru: "Диагностика монитора", ro: "Diagnosticare monitor", mid: 150 },
      { ru: "Ремонт монитора", ro: "Reparație monitor", mid: 400, hard: 600, fromHard: true },
      { ru: "Диагностика телевизора", ro: "Diagnosticare TV", mid: 200 },
      { ru: "Ремонт телевизора", ro: "Reparație TV", mid: 600, hard: 800, fromHard: true },
      { ru: "Диагностика мультимедиа-техники", ro: "Diagnosticare multimedia", mid: 100 },
      { ru: "Ремонт мультимедиа-техники", ro: "Reparație multimedia", mid: 200, hard: 300, fromHard: true }
    ]
  },

  power: {
    ru: "ИБП и блоки питания ноутбуков", ro: "UPS și alimentatoare laptop",
    items: [
      { ru: "Диагностика ИБП", ro: "Diagnosticare UPS", mid: 100 },
      { ru: "Ремонт ИБП", ro: "Reparație UPS", mid: 300, hard: 500, fromHard: true },
      { ru: "Замена аккумулятора ИБП", ro: "Schimbare baterie UPS", mid: 150, hard: 400, fromHard: true },
      { ru: "Диагностика блока питания ноутбука", ro: "Diagnosticare AC adapter", mid: 100 },
      { ru: "Замена кабеля блока питания ноутбука", ro: "Schimbare cablu AC adapter", mid: 150, from: true, note: "RO-прайс: 150 без «от» — уточнить" },
      { ru: "Ремонт кабеля блока питания ноутбука", ro: "Reparație cablu AC adapter", mid: 200, hard: 300 },
      { ru: "Ремонт блока питания ноутбука", ro: "Reparație AC adapter", mid: 200, hard: 300, fromHard: true }
    ]
  },

  office: {
    ru: "Принтеры и проекторы", ro: "Imprimante și proiectoare",
    items: [
      { ru: "Диагностика принтера", ro: "Diagnosticare imprimantă", mid: null, note: "в прайсе цены нет — уточнить" },
      { ru: "Заправка / восстановление картриджа", ro: "Regenerare / reparație cartuș", mid: 100, hard: 160, fromHard: true },
      { ru: "Ремонт принтера", ro: "Reparație imprimantă", mid: 350, hard: 600, fromHard: true, note: "RO-прайс: 300 — уточнить" },
      { ru: "Диагностика проектора", ro: "Diagnosticare proiector", mid: 100, note: "RO-прайс: 200 — уточнить" },
      { ru: "Ремонт проектора", ro: "Reparație proiector", mid: 400, hard: 600, fromHard: true }
    ]
  }
};
