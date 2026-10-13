(function () {
  var LANG = document.documentElement.lang === "ro" ? "ro" : "ru";
  var ROOT = document.body.getAttribute("data-root") || "";

  /* ---------- Тексты интерфейса ---------- */
  var T = {
    ru: { service: "Услуга", mid: "Средне", one: "", hard: "Сложно", from: "от", lei: "лей", ask: "по запросу", more: "Подробнее", none: "Ничего не найдено. Позвоните — подскажем цену." },
    ro: { service: "Serviciu", mid: "Mediu", one: "", hard: "Dificil", from: "de la", lei: "lei", ask: "la cerere", more: "Detalii", none: "Nimic găsit. Sunați-ne — vă spunem prețul." }
  }[LANG];

  /* Страница услуги для каждой категории прайса */
  var PAGES = {
    ru: { laptop: "remont-noutbukov.html", pc: "remont-kompyuterov.html", apple: "remont-imac-macbook.html", parts: "remont-komplektuyushchih.html", data: "vosstanovlenie-dannyh.html", software: "programmy-i-sistema.html", server: "servery.html", display: "remont-monitorov-i-tv.html", power: "remont-ibp.html", office: "remont-printerov.html" },
    ro: { laptop: "reparatie-laptop.html", pc: "reparatie-calculatoare.html", apple: "reparatie-imac-macbook.html", parts: "reparatie-componente.html", data: "recuperare-date.html", software: "programe-si-sistem.html", server: "servere.html", display: "reparatie-monitoare-tv.html", power: "reparatie-ups.html", office: "reparatie-imprimante.html" }
  }[LANG];

  function money(v, isFrom) {
    return (isFrom ? "<small>" + T.from + "</small>" : "") + v;
  }

  /* Три колонки цен: Средне | Цена (единая) | Сложно */
  function priceCells(it) {
    if (it.mid == null) return '<td class="pp"></td><td class="pp pc"><i>' + T.ask + '</i></td><td class="pp"></td>';
    if (it.hard == null) return '<td class="pp"></td><td class="pp pc">' + money(it.mid, it.from) + '</td><td class="pp"></td>';
    return '<td class="pp">' + money(it.mid, it.from) + '</td><td class="pp pc"></td><td class="pp">' + money(it.hard, it.fromHard) + "</td>";
  }
  function headRow() {
    return "<thead><tr><th>" + T.service + ", " + T.lei + "</th><th>" + T.mid + '</th><th class="pc">' + T.one + "</th><th>" + T.hard + "</th></tr></thead>";
  }

  /* Для поиска: нижний регистр, ё→е, румынские буквы без диакритики */
  function norm(t) {
    return t.toLowerCase().replace(/ё/g, "е").replace(/[ăâ]/g, "a").replace(/î/g, "i").replace(/[șş]/g, "s").replace(/[țţ]/g, "t");
  }

  function renderTable(key, withLink) {
    var cat = window.TEHVIC_PRICES && window.TEHVIC_PRICES[key];
    if (!cat) return "";
    var rows = cat.items.map(function (it, n) {
      var name = it[LANG] || it.ru;
      var cells;
      cells = priceCells(it);
      return '<tr id="r-' + key + "-" + n + '" data-q="' + norm(name + " " + it.ru + " " + it.ro) + '"><td class="pn">' + name + "</td>" + cells + "</tr>";
    }).join("");
    var link = withLink && PAGES[key] ? '<a href="' + ROOT + PAGES[key] + '">' + T.more + " →</a>" : "";
    /* .pcard — общая карточка: заголовок и таблица на одной подложке */
    return '<div class="pcard" id="p-' + key + '"><div class="ptable__cap"><h3>' + cat[LANG] + "</h3>" + link + "</div>" +
      '<table class="ptable">' + headRow() + "<tbody>" + rows + "</tbody></table></div>";
  }

  document.querySelectorAll("[data-prices]").forEach(function (box) {
    var keys = box.getAttribute("data-prices").split(",");
    var withLink = box.hasAttribute("data-links");
    box.innerHTML = keys.map(function (k) { return renderTable(k.trim(), withLink); }).join("");
  });

  function isDiag(it) { return /^Диагностика/.test(it.ru); }
  function getCat(k) { return window.TEHVIC_PRICES && window.TEHVIC_PRICES[k]; }

  /* data-from="laptop" → «от 200 лей» (минимальная цена работ, без диагностики) */
  document.querySelectorAll("[data-from]").forEach(function (el) {
    var cat = getCat(el.getAttribute("data-from"));
    if (!cat) return;
    var min = Infinity;
    cat.items.forEach(function (it) { if (!isDiag(it) && it.mid != null && it.mid < min) min = it.mid; });
    if (min < Infinity) el.textContent = T.from + " " + min + " " + T.lei;
  });

  /* data-diag="laptop" → «250 лей» (цена первой диагностики в категории) */
  document.querySelectorAll("[data-diag]").forEach(function (el) {
    var cat = getCat(el.getAttribute("data-diag"));
    if (!cat) return;
    for (var i = 0; i < cat.items.length; i++) {
      if (isDiag(cat.items[i]) && cat.items[i].mid != null) { el.textContent = cat.items[i].mid + " " + T.lei; return; }
    }
  });

  /* data-price="laptop:5" → «от 400 лей» (конкретная строка прайса, цена «средне») */
  document.querySelectorAll("[data-price]").forEach(function (el) {
    var p = el.getAttribute("data-price").split(":");
    var cat = getCat(p[0]);
    var it = cat && cat.items[+p[1]];
    if (!it || it.mid == null) return;
    el.textContent = (it.from ? T.from + " " : "") + it.mid + " " + T.lei;
  });

  /* data-pick="laptop:1,pc:0" → таблица «популярные услуги» из отдельных строк */
  document.querySelectorAll("[data-pick]").forEach(function (box) {
    var rows = box.getAttribute("data-pick").split(",").map(function (s) {
      var p = s.trim().split(":");
      var it = getCat(p[0]) && getCat(p[0]).items[+p[1]];
      if (!it) return "";
      return '<tr><td class="pn"><a href="' + ROOT + PAGES[p[0]] + '">' + (it[LANG] || it.ru) + '</a><span class="pcat">' + getCat(p[0])[LANG] + "</span></td>" + priceCells(it) + "</tr>";
    }).join("");
    box.innerHTML = '<div class="pcard"><table class="ptable">' + headRow() + "<tbody>" + rows + "</tbody></table></div>";
  });

  /* ---------- Поиск услуг: подсказки (шапка на всех страницах + страница цен) ----------
     Вводите слово («замена») — под полем список услуг с ценой, направления — сверху.
     Стрелки ↑↓ и Enter или клик:
       • строка прайса есть на этой странице — прокрутка к ней с подсветкой;
       • нет — переход на страницу услуги к нужной строке (#r-laptop-4).
     Enter без выбора — страница «Цены» с отфильтрованным прайсом (?q=…).
     Слова ищутся в любом порядке: «замена клав» найдёт «Замена клавиатуры». */
  var PRICES_PAGE = LANG === "ro" ? "preturi.html" : "ceny.html";
  var words = function (q) { return norm(q).split(/\s+/).filter(Boolean); };
  var matches = function (hay, ws) { for (var i = 0; i < ws.length; i++) if (hay.indexOf(ws[i]) < 0) return false; return true; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var mark = function (text, ws) {            // подсветка найденных кусков
    var low = norm(text), on = [];
    for (var z = 0; z < text.length; z++) on.push(false);
    ws.forEach(function (w) { var i = low.indexOf(w); while (i > -1) { for (var k = i; k < i + w.length; k++) on[k] = true; i = low.indexOf(w, i + w.length); } });
    var out = "", open = false;
    for (var i = 0; i < text.length; i++) {
      if (on[i] && !open) { out += "<mark>"; open = true; }
      if (!on[i] && open) { out += "</mark>"; open = false; }
      out += esc(text[i]);
    }
    return out + (open ? "</mark>" : "");
  };

  /* Индекс: направления + все услуги прайса */
  var IDX = [];
  Object.keys(window.TEHVIC_PRICES || {}).forEach(function (key) {
    var cat = window.TEHVIC_PRICES[key];
    IDX.push({ kind: "cat", href: ROOT + PAGES[key], name: cat[LANG], sub: T.more, q: norm(cat.ru + " " + cat.ro) });
    cat.items.forEach(function (it, n) {
      var name = it[LANG] || it.ru;
      var price = it.mid == null ? T.ask : (it.from ? T.from + " " : "") + it.mid + (it.hard != null ? "–" + it.hard : "") + " " + T.lei;
      IDX.push({ kind: "row", id: "r-" + key + "-" + n, href: ROOT + PAGES[key] + "#r-" + key + "-" + n,
                 name: name, sub: cat[LANG], price: price, q: norm(name + " " + it.ru + " " + it.ro + " " + cat.ru + " " + cat.ro) });
    });
  });

  var flashRow = function (row) {
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.classList.remove("is-found"); void row.offsetWidth; row.classList.add("is-found");
  };

  /* Подключение подсказок к полю. opts.onInput(ws) — доп. действие (фильтр таблиц) */
  var uid = 0;
  function attachSuggest(input, opts) {
    opts = opts || {};
    var list = document.createElement("ul");
    var id = "sg-" + (++uid);
    list.className = "psuggest"; list.id = id; list.setAttribute("role", "listbox"); list.hidden = true;
    input.parentNode.appendChild(list);
    input.setAttribute("role", "combobox"); input.setAttribute("aria-controls", id);
    input.setAttribute("aria-autocomplete", "list"); input.setAttribute("aria-expanded", "false");
    var active = -1;

    var closeList = function () { list.hidden = true; active = -1; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); };
    var items = function () { return list.querySelectorAll("li[data-k]"); };
    var setActive = function (i) {
      var it = items(); if (!it.length) return;
      active = (i + it.length) % it.length;
      it.forEach(function (li, k) { li.classList.toggle("is-on", k === active); li.setAttribute("aria-selected", k === active ? "true" : "false"); });
      it[active].scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", it[active].id);
    };
    var found = [];
    var pick = function (x) {
      closeList();
      if (x.kind === "row") {
        if (opts.onInput) opts.onInput([]);          // на странице цен — показать весь прайс
        var row = document.getElementById(x.id);
        if (row && row.offsetParent !== null) { input.blur(); flashRow(row); return; }
      }
      location.href = x.href;
    };

    input.addEventListener("input", function () {
      var ws = words(input.value);
      if (opts.onInput) opts.onInput(ws);
      if (!ws.length) { closeList(); return; }
      var cats = IDX.filter(function (x) { return x.kind === "cat" && matches(x.q, ws); });
      var rows = IDX.filter(function (x) { return x.kind === "row" && matches(x.q, ws); });
      found = cats.concat(rows);
      list.innerHTML = found.length
        ? found.map(function (x, k) {
            return '<li id="' + id + "-" + k + '" role="option" data-k="' + k + '"' + (x.kind === "cat" ? ' class="is-cat"' : "") +
              '><span class="psuggest__n">' + mark(x.name, ws) + "<small>" + esc(x.sub) + "</small></span>" +
              (x.price ? "<b>" + esc(x.price) + "</b>" : '<svg class="ico" aria-hidden="true"><use href="' + ICONS + '#arrow"/></svg>') + "</li>";
          }).join("") + '<li class="psuggest__all">' + (LANG === "ro" ? "Găsite: " : "Найдено: ") + rows.length + (LANG === "ro" ? " · Enter — toate în lista de prețuri" : " · Enter — все в прайсе") + "</li>"
        : '<li class="psuggest__none">' + T.none + "</li>";
      list.hidden = false; active = -1; input.setAttribute("aria-expanded", "true");
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeList(); return; }
      if (e.key === "ArrowDown" && !list.hidden) { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp" && !list.hidden) { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        if (active > -1 && found[active]) { pick(found[active]); return; }
        var q = input.value.trim();
        if (!q) return;
        if (opts.onInput) { closeList(); input.blur(); return; }   // уже на странице цен — фильтр применён
        location.href = ROOT + PRICES_PAGE + "?q=" + encodeURIComponent(q);
      }
    });
    list.addEventListener("mousedown", function (e) {     // mousedown — раньше, чем поле потеряет фокус
      var li = e.target.closest("li[data-k]");
      if (!li) return;
      e.preventDefault(); pick(found[+li.getAttribute("data-k")]);
    });
    input.addEventListener("focus", function () { if (input.value.trim() && list.innerHTML) { list.hidden = false; input.setAttribute("aria-expanded", "true"); } });
    input.addEventListener("blur", function () { setTimeout(closeList, 150); });
  }

  /* Путь к иконкам: на румынских страницах — уровень выше */
  var ICONS = (document.querySelector('link[rel="stylesheet"]').getAttribute("href").indexOf("../") === 0 ? "../" : "") + "img/icons.svg";

  /* Страница цен: поле + фильтр таблиц, ?q= из шапки */
  var search = document.getElementById("psearch");
  if (search) {
    var empty = document.querySelector(".pempty");
    var filterTables = function (ws) {
      var any = false;
      document.querySelectorAll(".prices-all .pcard").forEach(function (tb) {
        var shown = 0;
        tb.querySelectorAll("tbody tr").forEach(function (tr) {
          var ok = !ws.length || matches(tr.getAttribute("data-q"), ws);
          tr.style.display = ok ? "" : "none";
          if (ok) shown++;
        });
        tb.style.display = shown ? "" : "none";
        if (shown) any = true;
      });
      if (empty) empty.style.display = any ? "none" : "block";
    };
    attachSuggest(search, { onInput: filterTables });
    var q0 = new URLSearchParams(location.search).get("q");
    if (q0) { search.value = q0; filterTables(words(q0)); }
  }

  /* Липкая шапка таблиц: на странице «Цены» — под закреплённой панелью поиска */
  var pfilter = document.querySelector(".pfilter");
  if (pfilter) {
    var setTheadTop = function () {   // высота панели; общий сдвиг от выехавшей шапки — --top-offset
      document.documentElement.style.setProperty("--pf-h", pfilter.offsetHeight + "px");
    };
    setTheadTop();
    window.addEventListener("resize", setTheadTop);
    window.addEventListener("load", setTheadTop);   // после загрузки шрифтов высота панели может измениться
  }

  /* Поле в шапке и в мобильном меню — на всех страницах */
  document.querySelectorAll(".gsearch input").forEach(function (inp) { attachSuggest(inp); });

  /* Пришли по ссылке #r-… — подсветить строку прайса */
  if (/^#r-/.test(location.hash)) {
    var hrow = document.getElementById(location.hash.slice(1));
    if (hrow) setTimeout(function () { flashRow(hrow); }, 250);
  }

  var chips = document.querySelectorAll(".pchip");
  chips.forEach(function (ch) {
    ch.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-on"); });
      ch.classList.add("is-on");
    });
  });

  /* ---------- «Умная» шапка ----------
     Верхняя строка и шапка собраны в один липкий блок .site-top.
     Прокрутка вниз — блок уезжает вверх; прокрутка вверх — выезжает.
     На телефоне выезжает только шапка (строка с городом остаётся скрытой).
     --top-offset — сколько сейчас занимает выехавшая шапка: по нему сдвигаются
     панель поиска на «Ценах» и шапки таблиц прайса. */
  (function () {
    var topbar = document.querySelector(".topbar"), header = document.querySelector(".header");
    if (!topbar || !header) return;
    var box = document.createElement("div");
    box.className = "site-top";
    topbar.parentNode.insertBefore(box, topbar);
    box.appendChild(topbar); box.appendChild(header);
    var root = document.documentElement;
    var mq = window.matchMedia("(max-width:960px)");
    var lastY = window.scrollY, state = "";

    var setState = function (st) {
      if (st === state) return;
      state = st;
      box.classList.toggle("is-hidden", st === "hidden");
      box.classList.toggle("is-compact", st === "compact");
      var shown = st === "hidden" ? 0 : st === "compact" ? box.offsetHeight - topbar.offsetHeight : box.offsetHeight;
      root.style.setProperty("--top-offset", (st === "top" ? 0 : shown) + "px");
      root.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
    };
    var busy = function () {           // не прятать, пока открыто меню или идёт поиск
      return document.querySelector(".nav__item.is-open") ||
             (document.activeElement && document.activeElement.closest && document.activeElement.closest(".site-top .gsearch"));
    };
    var onScroll = function () {
      var y = window.scrollY, dy = y - lastY;
      if (y <= box.offsetHeight) { setState("top"); lastY = y; return; }
      if (Math.abs(dy) < 6) return;
      if (dy > 0 && !busy()) setState("hidden");
      else if (dy < 0) setState(mq.matches ? "compact" : "shown");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { state = ""; onScroll(); });
    setState("top");
  })();

  /* ---------- Мега-меню ---------- */
  var megaItem = document.querySelector(".nav__item--mega");
  if (megaItem) {
    var megaBtn = megaItem.querySelector(".nav__a");
    var closeT;
    var open = function () { clearTimeout(closeT); megaItem.classList.add("is-open"); megaBtn.setAttribute("aria-expanded", "true"); };
    var close = function () { megaItem.classList.remove("is-open"); megaBtn.setAttribute("aria-expanded", "false"); };
    megaBtn.addEventListener("click", function (e) {
      e.preventDefault();
      megaItem.classList.contains("is-open") ? close() : open();
    });
    if (window.matchMedia("(hover:hover)").matches) {
      megaItem.addEventListener("mouseenter", open);
      megaItem.addEventListener("mouseleave", function () { closeT = setTimeout(close, 180); });
    }
    document.addEventListener("click", function (e) { if (!megaItem.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- Мобильное меню ---------- */
  var mnav = document.getElementById("mnav");
  document.querySelectorAll("[data-mnav-search]").forEach(function (b) {
    b.addEventListener("click", function () {
      var inp = document.querySelector("#mnav .gsearch input");
      if (inp) setTimeout(function () { inp.focus(); }, 60);
    });
  });
  document.querySelectorAll("[data-mnav]").forEach(function (b) {
    b.addEventListener("click", function () {
      var on = !mnav.classList.contains("is-open");
      mnav.classList.toggle("is-open", on);
      document.body.style.overflow = on ? "hidden" : "";
    });
  });

  /* ---------- Jivo: кнопка «Чат» открывает окно Jivo ----------
     Подключается только если в генераторе задан JIVO_ID. Пока виджет
     не загрузился (или заблокирован), ссылка ведёт в WhatsApp. */
  document.querySelectorAll("[data-jivo]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (window.jivo_api && typeof window.jivo_api.open === "function") {
        e.preventDefault();
        window.jivo_api.open();
      }
    });
  });

  /* ---------- Заявка в WhatsApp ---------- */
  var form = document.getElementById("wa-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var lines = [
        (LANG === "ro" ? "Bună ziua! Cerere de pe site." : "Здравствуйте! Заявка с сайта."),
        (LANG === "ro" ? "Dispozitiv: " : "Устройство: ") + f.device.value,
        (LANG === "ro" ? "Problema: " : "Проблема: ") + f.problem.value,
        (LANG === "ro" ? "Nume: " : "Имя: ") + f.name.value
      ];
      window.open("https://wa.me/" + form.getAttribute("data-wa") + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Hero: выбор устройства ----------
     Плитка устройства подсвечивается, по её проводу бежит импульс,
     в карточке — диагностика и три частых ремонта из prices.js.
     Пока посетитель ничего не нажал, устройства переключаются сами. */
  var hp = document.querySelector("[data-hpick]");
  if (hp) {
    var HP = {
      laptop: { t: LANG === "ro" ? "Laptop" : "Ноутбук", picks: [5, 4, 1] },
      pc:     { t: LANG === "ro" ? "Calculator" : "Компьютер", picks: [1, 2, 6] },
      office: { t: LANG === "ro" ? "Imprimantă" : "Принтер", picks: [1, 2, 4] },
      server: { t: LANG === "ro" ? "Server" : "Сервер", picks: [3, 2, 1] }
    };
    var order = ["laptop", "pc", "office", "server"];
    var tabs = hp.querySelectorAll(".hpick__tab");
    var auto = null, picked = false, idx = 0;
    var stopAuto = function () { clearInterval(auto); auto = null; };
    var startAuto = function () {
      if (auto || picked) return;
      auto = setInterval(function () { idx = (idx + 1) % order.length; show(order[idx]); }, 4200);
    };

    var show = function (key) {
      var cat = getCat(key), cfg = HP[key];
      if (!cat || !cfg) return;
      hp.setAttribute("data-active", key);
      tabs.forEach(function (b) {
        var on = b.getAttribute("data-dev") === key;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      hp.querySelectorAll(".tile--dev").forEach(function (t) { t.classList.toggle("is-on", t.getAttribute("data-dev") === key); });
      hp.querySelectorAll(".wire[data-w]").forEach(function (w) { w.classList.toggle("is-on", w.getAttribute("data-w") === key); });
      var diag = "";
      for (var i = 0; i < cat.items.length; i++) { if (isDiag(cat.items[i]) && cat.items[i].mid != null) { diag = cat.items[i].mid + " " + T.lei; break; } }
      hp.querySelector("[data-hp-title]").textContent = cfg.t;
      hp.querySelector("[data-hp-diag]").textContent = diag || T.ask;
      hp.querySelector("[data-hp-list]").innerHTML = cfg.picks.map(function (n) {
        var it = cat.items[n];
        if (!it) return "";
        return "<li><span>" + (it[LANG] || it.ru) + "</span><b>" + money(it.mid, it.from) + " " + T.lei + "</b></li>";
      }).join("");
      hp.querySelector("[data-hp-link]").setAttribute("href", ROOT + PAGES[key]);
      var card = hp.querySelector(".hpick__card");
      card.classList.remove("is-swap"); void card.offsetWidth; card.classList.add("is-swap");
    };

    tabs.forEach(function (b) {
      b.addEventListener("click", function () { picked = true; stopAuto(); show(b.getAttribute("data-dev")); });
    });
    show("laptop");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* Наведение — пауза, мышь ушла — переключение продолжается.
         Насовсем останавливается только после нажатия на устройство. */
      startAuto();
      hp.addEventListener("mouseenter", stopAuto);
      hp.addEventListener("mouseleave", function () { if (!picked) startAuto(); });
    }
  }

  /* ---------- FAQ: плавное открытие и закрытие ----------
     <details> открывается мгновенно, поэтому высоту блока анимируем сами.
     Скорость — DUR (мс). */
  var DUR = 320;
  document.querySelectorAll(".faq details").forEach(function (d) {
    var sum = d.querySelector("summary");
    var anim = null;
    sum.addEventListener("click", function (e) {
      if (!d.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      if (anim) anim.cancel();
      d.style.overflow = "hidden";
      var start = d.offsetHeight + "px";
      var opening = !d.open;
      if (opening) d.open = true;
      var end = (opening ? d.scrollHeight : sum.offsetHeight) + "px";
      d.classList.toggle("is-closing", !opening);
      anim = d.animate({ height: [start, end] }, { duration: DUR, easing: "cubic-bezier(.2,.7,.2,1)" });
      anim.onfinish = function () {
        if (!opening) d.open = false;
        d.classList.remove("is-closing");
        d.style.overflow = ""; anim = null;
      };
      anim.oncancel = function () { anim = null; };
    });
  });

  /* ---------- Появление при прокрутке ---------- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
