const DEFAULT_PASSWORDS = {
  admin: "GgspnV8y4n!",
  tech: "0606"
};

const DEFAULT_DATA = {
  springs: {
    title: "Springs",
    groups: [
      {
        key: "side",
        label: "Spring color / quantity",
        multi: false,
        required: true,
        options: [
          { label: "Red", price: 550 },
          { label: "Black", price: 550 },
          { label: "Pair", price: 1200 }
        ]
      },
      {
        key: "size",
        label: "Size",
        multi: false,
        required: true,
        options: [
          "207","218","225","234","243","250","262","273","283","289","295"
        ].map((label, index) => ({ label, price: 60 + index * 20 }))
      },
      {
        key: "diameter",
        label: "Diameter",
        multi: false,
        required: true,
        options: [
          { label: "1.75", price: 15 },
          { label: "2", price: 20 },
          { label: "2.625", price: 25 }
        ]
      },
      {
        key: "length",
        label: "Length",
        multi: false,
        required: true,
        options: Array.from({ length: 23 }, (_, index) => {
          const length = 19 + index;
          return { label: String(length), price: 2 + index * 2 };
        })
      },
      {
        key: "discounts",
        label: "Discount / Add-ons",
        multi: true,
        required: false,
        options: [
          { label: "Returning customer · 10%", price: 0, percent: 10 },
          { label: "Veteran · 7.5%", price: 0, percent: 7.5 },
          { label: "Senior · 10%", price: 0, percent: 10 }
        ]
      }
    ]
  },
  openers: {
    title: "Openers",
    groups: [
      {
        key: "brand",
        label: "Brand",
        multi: false,
        required: true,
        options: [
          { label: "Chamberlain · 1/2 HP", price: 425 },
          { label: "Chamberlain · 3/4 HP", price: 700 },
          { label: "Chamberlain · Smart DC · Camera", price: 1100 },
          { label: "LiftMaster · 1/2 HP", price: 1550 },
          { label: "LiftMaster · 3/4 HP · Heavy Duty", price: 1800 },
          { label: "LiftMaster · Smart DC · Camera", price: 2000 },
          { label: "Chamberlain · Side Mount", price: 1650, mount: "wall" },
          { label: "LiftMaster · Side Mount", price: 2400, mount: "wall" }
        ]
      },
      {
        key: "rails",
        label: "Rails",
        multi: false,
        required: true,
        options: [
          { label: "7 ft", price: 165 },
          { label: "8 ft", price: 225 },
          { label: "9 ft", price: 345 },
          { label: "10 ft", price: 375 },
          { label: "No rail", price: 0 }
        ]
      }
    ]
  },
  doors: {
    title: "Doors",
    groups: [
      {
        key: "size",
        label: "Garage door size",
        multi: false,
        required: true,
        options: [
          { label: "8x6.3", price: 1950 },
          { label: "8x6.6", price: 2025 },
          { label: "8x6.9", price: 2175 },
          { label: "8x7", price: 2355 },
          { label: "8x8", price: 2375 },
          { label: "9x7", price: 2385 },
          { label: "9x8", price: 2425 },
          { label: "10x7", price: 2745 },
          { label: "10x8", price: 2765 },
          { label: "16x7", price: 2885 },
          { label: "16x8", price: 3015 },
          { label: "18x7", price: 3035 },
          { label: "18x8", price: 3350 }
        ]
      },
      {
        key: "insulation",
        label: "Insulation",
        multi: false,
        required: true,
        options: [
          { label: 'Standard 2" thick non-insulated', price: 0 },
          { label: '2" thick poly-board / poly-back insulated', price: 375 },
          { label: '2" thick sandwich insulated steelback', price: 575 }
        ]
      },
      {
        key: "color",
        label: "Color",
        multi: false,
        required: true,
        options: [
          { label: "White", price: 0 },
          { label: "Almond", price: 0 },
          { label: "Sandstone", price: 0 },
          { label: "Brown", price: 0 },
          { label: "Custom color", price: 0 }
        ]
      },
      {
        key: "shape",
        label: "Door shape",
        multi: false,
        required: true,
        options: [
          { label: "Short panel", price: 0 },
          { label: "Long panel", price: 0 },
          { label: "Flush", price: 450 }
        ]
      },
      {
        key: "windows",
        label: "Windows",
        multi: false,
        required: true,
        options: [
          { label: "No windows", price: 0 },
          { label: "Long panel windows", price: 365 },
          { label: "Short panel windows", price: 365 }
        ]
      },
      {
        key: "extra",
        label: "Extra",
        multi: true,
        required: false,
        options: [
          { label: "10 silicon rollers", price: 145 },
          { label: "70,000 cycle springs", price: 465 },
          { label: "EXTENSION SPRING SYSTEM", price: -150 }
        ]
      }
    ]
  }
};

function applyPriceRevision(catalog) {
  if (catalog.openers && catalog.openers.priceRevision !== "20261019-v3") {
    catalog.openers.groups.find(group => group.key === "brand")?.options.forEach(option => {
      if (/chamberlain/i.test(option.label)) option.price = (Number(option.price) || 0) + 200;
      else if (/liftmaster/i.test(option.label)) option.price = (Number(option.price) || 0) + 400;
    });
    catalog.openers.priceRevision = "20261019-v3";
  }
  if (catalog.doors && catalog.doors.priceRevision !== "20261019-v3") {
    catalog.doors.groups.find(group => group.key === "size")?.options.forEach(option => {
      const width = parseFloat(option.label);
      if (Number.isFinite(width)) option.price = Math.max(0, (Number(option.price) || 0) + (width >= 16 ? 350 : -350));
    });
    catalog.doors.groups.find(group => group.key === "insulation")?.options.forEach(option => {
      if (/steelback|sandwich/i.test(option.label)) option.price = Math.round((Number(option.price) || 0) * 125) / 100;
    });
    catalog.doors.groups.find(group => group.key === "color")?.options.forEach(option => {
      if (option.label.trim().toLowerCase() !== "white") option.price = (Number(option.price) || 0) + 150;
    });
    catalog.doors.priceRevision = "20261019-v3";
  }
}
DEFAULT_DATA.openers.catalogVersion = 2;
applyPriceRevision(DEFAULT_DATA);

const DATA_KEY = "lgdsPricingCalculatorData.v1";
const PASS_KEY = "lgdsPricingCalculatorPasswords.v1";
const SETTINGS_API = "/.netlify/functions/settings";
let lastAdminPasswordForSync = null;
let syncTimer = null;
let globalSyncEnabled = true;

let data = loadData();
let passwords = loadPasswords();
let selectedCategory = null;
let currentRole = "tech";
let loggedRole = null;
let selections = {};
let quantity = 1;
let quoteExtras = [];
let quoteDiscount = { type: "fixed", value: 0 };
let adjustmentsOpen = false;

// Labels are presentation only; retain the existing option prices and indices.
function normalizeSpringLabels() {
  const discounts = data.springs?.groups.find(group => group.key === "discounts");
  if (discounts) discounts.options = clone(DEFAULT_DATA.springs.groups.find(group => group.key === "discounts").options);
  if (data.openers?.groups) {
    if (data.openers.catalogVersion !== 2) {
      const brand = data.openers.groups.find(group => group.key === "brand");
      if (brand) brand.options = clone(DEFAULT_DATA.openers.groups.find(group => group.key === "brand").options);
      data.openers.catalogVersion = 2;
      data.openers.priceRevision = DEFAULT_DATA.openers.priceRevision;
    }

    data.openers.groups = data.openers.groups.filter(group => !/labor|warranty/i.test(group.key) && !/labor|warranty/i.test(group.label));
    data.openers.groups.forEach(group => group.options.forEach(option => {
      option.label = option.label.replace(/\s*\+\s*.*?warranty\b/gi, "").trim();
    }));
  }
  applyPriceRevision(data);
  const side = data.springs?.groups.find(group => group.key === "side");
  if (!side) return;
  side.label = "Spring color / quantity";
  side.options.forEach(option => {
    if (option.label === "Left") option.label = "Red";
    if (option.label === "Right") option.label = "Black";
  });
}
normalizeSpringLabels();

const $ = (id) => document.getElementById(id);

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY)) || clone(DEFAULT_DATA);
  } catch {
    return clone(DEFAULT_DATA);
  }
}

function saveData() {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  queueGlobalSave();
}

function loadPasswords() {
  try {
    return { ...DEFAULT_PASSWORDS, ...(JSON.parse(localStorage.getItem(PASS_KEY)) || {}) };
  } catch {
    return { ...DEFAULT_PASSWORDS };
  }
}

function savePasswords() {
  localStorage.setItem(PASS_KEY, JSON.stringify(passwords));
  queueGlobalSave();
}


async function loadGlobalSettings() {
  if (!globalSyncEnabled) return;
  try {
    const res = await fetch(SETTINGS_API, { cache: "no-store" });
    if (!res.ok) return;
    const remote = await res.json();

    if (remote?.data) {
      data = remote.data;
      normalizeSpringLabels();
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }

    if (remote?.passwords) {
      passwords = { ...DEFAULT_PASSWORDS, ...remote.passwords };
      localStorage.setItem(PASS_KEY, JSON.stringify(passwords));
    }
  } catch (error) {
    console.warn("Global settings unavailable, using local/default settings.", error);
  }
}

function queueGlobalSave() {
  if (!globalSyncEnabled || loggedRole !== "admin" || !lastAdminPasswordForSync) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(saveGlobalSettings, 450);
}

async function saveGlobalSettings() {
  if (!lastAdminPasswordForSync) return;

  try {
    const res = await fetch(SETTINGS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminPassword: lastAdminPasswordForSync,
        currentPasswords: passwords,
        data,
        passwords
      })
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      alert(payload.error || "Global save failed. Check admin password.");
    }
  } catch (error) {
    alert("Global save failed. Check Netlify deploy/functions.");
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  $(id).classList.add("active");
  $("logoutBtn").classList.toggle("hidden", id !== "calculatorScreen");
  $("jumpTotalBtn").classList.add("hidden");
  $("livePriceBar").hidden = id !== "calculatorScreen";
  if (id !== "calculatorScreen" && $("quoteTools").open) $("quoteTools").close();
}

function setRole(role) {
  currentRole = role;
  document.querySelectorAll(".role").forEach(btn => btn.classList.toggle("active", btn.dataset.role === role));
  $("passwordInput").value = "";
  $("loginError").classList.add("hidden");
}

function startLogin(category) {
  selectedCategory = category;
  $("loginTitle").textContent = `${data[category].title} Login`;
  setRole("tech");
  showScreen("loginScreen");
  setTimeout(() => $("passwordInput").focus(), 50);
}

function login() {
  const typed = $("passwordInput").value;
  if (typed === passwords[currentRole]) {
    loggedRole = currentRole;
    if (currentRole === "admin") lastAdminPasswordForSync = typed;
    $("loginError").classList.add("hidden");
    startCalculator();
  } else {
    $("loginError").classList.remove("hidden");
  }
}

function initSelections() {
  selections = {};
  const groups = data[selectedCategory].groups;
  groups.forEach(group => {
    if (group.multi) {
      selections[group.key] = [];
    } else {
      selections[group.key] = null;
    }
  });
  quantity = 1;
  quoteExtras = [];
  quoteDiscount = { type: "fixed", value: 0 };
  adjustmentsOpen = false;
}

function startCalculator() {
  initSelections();
  $("calcTitle").textContent = `${data[selectedCategory].title} Calculator`;
  $("roleLabel").textContent = loggedRole === "admin" ? "Admin mode: calculator + editable pricing." : "Technician mode.";
  $("adminPanel").classList.toggle("hidden", loggedRole !== "admin");
  document.body.classList.toggle("tech-mode", loggedRole === "tech");
  document.body.classList.toggle("admin-view", loggedRole === "admin");
  renderForm();
  if (loggedRole === "admin") renderAdmin();
  calculate();
  document.body.classList.toggle("tech-mode", loggedRole === "tech");
  document.body.classList.toggle("admin-view", loggedRole === "admin");
  showScreen("calculatorScreen");
}


function renderForm() {
  const form = $("formArea");
  form.innerHTML = "";

  form.appendChild(buildCustomerIntro(selectedCategory));

  if (!document.body.classList.contains("admin-view")) {
    const backWrap = document.createElement("div");
    backWrap.className = "customer-back-wrap";
    backWrap.innerHTML = `<button type="button" class="customer-back" id="customerBackBtn">← Back</button>`;
    form.appendChild(backWrap);
  }

  data[selectedCategory].groups.forEach(group => {
    if (/discount/i.test(group.key)) return;
    const section = document.createElement("section");
    section.className = "group";
    section.dataset.groupKey = group.key;
    section.dataset.groupKey = group.key;
    const showOptionPrices = /discount/i.test(group.label) || /discount/i.test(group.key);
    if (showOptionPrices) section.classList.add("price-visible");

    section.innerHTML = `
      <div class="group-title">
        <h3>${escapeHtml(group.label)}</h3>
        <span class="selection-label">${group.multi ? "Optional" : "Choose one"}</span>
      </div>
      <div class="group-content">
        <div class="options"></div>
      </div>
    `;

    const optionsWrap = section.querySelector(".options");

    const title = section.querySelector(".group-title");
    title.addEventListener("click", () => {
      const alreadyOpen = section.classList.contains("open");
      document.querySelectorAll(".group").forEach(g => g.classList.remove("open"));
      if (!alreadyOpen) section.classList.add("open");
    });

    group.options.forEach((option, optionIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      if (Number(option.price) < 0) btn.classList.add("negative");
      btn.dataset.groupKey = group.key;
      btn.dataset.optionIndex = optionIndex;
      btn.innerHTML = optionButtonHTML(option);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectOption(group, optionIndex);
      });
      optionsWrap.appendChild(btn);
    });

    form.appendChild(section);
  });

  const qty = document.createElement("div");
  qty.className = "qty-row";
  qty.innerHTML = `
    <strong>Quantity</strong>
    <input id="qtyInput" aria-label="Number of units" type="number" min="1" max="100" step="1" value="${quantity}" />
  `;
  form.appendChild(qty);

  $("qtyInput").addEventListener("input", () => {
    quantity = Math.min(100, Math.max(1, parseInt($("qtyInput").value || "1", 10)));
    renderExtras();
    calculate();
  });

  const extras = document.createElement("section");
  extras.className = "quote-extras";
  extras.innerHTML = `<h3>Additional services</h3><div id="extrasList"></div>
    <button type="button" id="addExtraBtn" class="ghost">+ Add extra</button>
    <button type="button" id="adjustmentsBtn" class="ghost">Adjustments</button>`;
  form.appendChild(extras);
  $("addExtraBtn").onclick = () => openQuoteTools("extras");
  $("adjustmentsBtn").onclick = () => openQuoteTools("discount");
  renderExtras();

  const bottomTotal = document.createElement("div");
  bottomTotal.className = "bottom-total";
  bottomTotal.innerHTML = `
    <div id="bottomTotalAmount" class="total-number">$0</div>
    <p class="total-caption">Selected services total</p><p class="quote-tax-note">Tax and payment fees are not calculated here.</p>
  `;
  form.appendChild(bottomTotal);

  if (selectedCategory === "doors") {
    const gallery = document.createElement("div");
    gallery.className = "doors-bottom-gallery";
    gallery.innerHTML = `<img src="assets/doors-visuals-full.png" alt="Door style examples" />`;
    form.appendChild(gallery);
  }

  refreshActiveButtons();
  const firstGroup = form.querySelector(".group");
  if (firstGroup && !document.body.classList.contains("admin-view")) firstGroup.classList.add("open");

  const customerBackBtn = $("customerBackBtn");
  if (customerBackBtn) {
    customerBackBtn.addEventListener("click", () => showScreen("loginScreen"));
  }
}

function selectOption(group, optionIndex) {
  if (group.multi) {
    const arr = selections[group.key] || [];
    const exists = arr.includes(optionIndex);
    selections[group.key] = exists ? arr.filter(i => i !== optionIndex) : [...arr, optionIndex];
  } else {
    selections[group.key] = optionIndex;
  }

  refreshActiveButtons();
  calculate();

  if (!group.multi && !document.body.classList.contains("admin-view")) {
    const groups = [...document.querySelectorAll(".group")];
    const currentSection = [...groups].find(g => g.querySelector(`.option[data-group-key="${group.key}"]`));
    const idx = groups.indexOf(currentSection);
    if (idx >= 0) {
      currentSection.classList.remove("open");
      const next = groups[idx + 1];
      if (next) next.classList.add("open");
    }
  }
}

function refreshActiveButtons() {
  document.querySelectorAll(".option").forEach(btn => {
    const groupKey = btn.dataset.groupKey;
    const optionIndex = Number(btn.dataset.optionIndex);
    const selected = selections[groupKey];
    btn.classList.toggle("active", Array.isArray(selected) ? selected.includes(optionIndex) : selected === optionIndex);
  });
}

function computeQuote(groups, chosen, units, extras, discount) {
  const cents = value => Math.round((Number(value) || 0) * 100);
  const lines = [];
  let unitCents = 0;
  const selectedOpener = groups.find(group => group.key === "brand")?.options[chosen.brand];
  groups.filter(group => !/discount/i.test(group.key) && !(selectedOpener?.mount === "wall" && group.key === "rails")).forEach(group => {
    const picked = chosen[group.key];
    (Array.isArray(picked) ? picked : [picked]).forEach(index => {
      if (index === null || index === undefined || !group.options[index]) return;
      const option = group.options[index];
      unitCents += cents(option.price);
      lines.push({ group: group.label, label: option.label, price: Number(option.price) || 0 });
    });
  });
  const count = Math.min(100, Math.max(1, Math.floor(Number(units) || 1)));
  const base = Math.max(0, unitCents * count);
  const extraCents = extras.reduce((sum, item) => sum + Math.max(0, cents(item.price)) * Math.max(1, Math.floor(Number(item.quantity) || 1)) * (item.perUnit ? count : 1), 0);
  const subtotal = base + extraCents;
  const rawDiscount = discount.type === "percent"
    ? Math.round(subtotal * Math.min(100, Math.max(0, Number(discount.value) || 0)) / 100)
    : cents(Math.max(0, Number(discount.value) || 0));
  const reduction = Math.min(subtotal, rawDiscount);
  return { lines, subtotal: subtotal / 100, discount: reduction / 100, total: (subtotal - reduction) / 100 };
}

function calculate() {
  const brand = data.openers?.groups.find(group => group.key === "brand");
  const wallMount = selectedCategory === "openers" && brand?.options[selections.brand]?.mount === "wall";
  const railsSection = document.querySelector('.group[data-group-key="rails"]');
  if (railsSection) railsSection.hidden = !!wallMount;
  const quoteGroups = data[selectedCategory].groups.filter(group => !(wallMount && group.key === "rails"));
  const result = computeQuote(quoteGroups, selections, quantity, quoteExtras, quoteDiscount);
  $("totalAmount").textContent = money(result.total);
  if ($("bottomTotalAmount")) $("bottomTotalAmount").textContent = money(result.total);
  $("liveTotal").textContent = money(result.total);
  $("liveTotal").classList.remove("price-updated");
  void $("liveTotal").offsetWidth;
  $("liveTotal").classList.add("price-updated");
  const summary = $("summaryArea");
  summary.innerHTML = "";
  const row = (label, value) => {
    const el = document.createElement("div");
    el.className = "summary-line";
    el.innerHTML = `<span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span>`;
    summary.appendChild(el);
  };
  result.lines.forEach(line => row(`${line.group}: ${line.label}`, loggedRole === "admin" ? money(line.price) : "Included"));
  if (quantity > 1) row("Units", String(quantity));
  quoteExtras.forEach(item => row(`${item.label} × ${item.quantity}${item.perUnit ? " per unit" : ""}`, money(item.price * item.quantity * (item.perUnit ? quantity : 1))));
  if (result.discount) row("Applied discount", `−${money(result.discount)}`);
  row("Selected services total", money(result.total));
  document.querySelectorAll(".group").forEach(section => {
    const button = section.querySelector(".option");
    if (!button) return;
    const group = data[selectedCategory].groups.find(g => g.key === button.dataset.groupKey);
    const picked = selections[group.key];
    const indexes = Array.isArray(picked) ? picked : [picked];
    section.querySelector(".selection-label").textContent = indexes.map(i => group.options[i]?.label).filter(Boolean).join(", ") || (group.multi ? "Optional" : "Choose one");
  });
}

function renderExtras() {
  const list = $("extrasList");
  if (!list) return;
  list.innerHTML = "";
  quoteExtras.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "summary-line";
    row.innerHTML = `<span>${escapeHtml(item.label)} × ${item.quantity}${item.perUnit ? " per unit" : ""}</span><span>${money(item.price * item.quantity * (item.perUnit ? quantity : 1))} <button type="button" aria-label="Remove extra">×</button></span>`;
    row.querySelector("button").onclick = () => { quoteExtras.splice(index, 1); renderExtras(); calculate(); };
    list.appendChild(row);
  });
}

function openQuoteTools(mode) {
  const dialog = $("quoteTools");
  adjustmentsOpen = true;
  $("discountTools").hidden = mode !== "discount";
  $("extraTools").hidden = mode !== "extras";
  $("toolsTitle").textContent = mode === "discount" ? "Price adjustment" : "Add extra";
  $("discountType").value = quoteDiscount.type;
  $("discountValue").value = quoteDiscount.value;
  const presets = $("discountPresets");
  presets.innerHTML = "";
  const selectedPresets = quoteDiscount.presets || [];
  const presetOptions = [
    { id: "returning", label: "Returning customer", percent: 10 },
    { id: "veteran", label: "Veteran", percent: 7.5 },
    { id: "senior", label: "Senior", percent: 10 }
  ];
  presetOptions.forEach(option => {
    const label = document.createElement("label");
    label.className = "checkbox-label";
    label.innerHTML = `<input type="checkbox" data-discount-id="${option.id}" data-percent="${option.percent}" /> ${option.label} · ${option.percent}%`;
    const input = label.querySelector("input");
    input.checked = selectedPresets.includes(option.id);
    input.onchange = () => {
      if (input.checked && option.id !== "veteran") {
        presets.querySelectorAll("input").forEach(other => {
          if (other !== input && other.dataset.discountId !== "veteran") other.checked = false;
        });
      }
      $("discountType").value = "percent";
      $("discountValue").value = [...presets.querySelectorAll("input:checked")].reduce((sum, el) => sum + Number(el.dataset.percent), 0);
    };
    presets.appendChild(label);
  });
  const clearPresetChecks = () => presets.querySelectorAll("input").forEach(input => { input.checked = false; });
  $("discountType").onchange = clearPresetChecks;
  $("discountValue").oninput = clearPresetChecks;
  $("toolError").textContent = "";
  dialog.showModal();
}

function renderAdmin() {
  $("adminPassInput").value = passwords.admin;
  $("techPassInput").value = passwords.tech;

  const editor = $("adminEditor");
  editor.innerHTML = "";

  data[selectedCategory].groups.forEach((group, groupIndex) => {
    const section = document.createElement("section");
    section.className = "editor-section";
    section.innerHTML = `<h3>${escapeHtml(group.label)}</h3>`;

    group.options.forEach((option, optionIndex) => {
      const row = document.createElement("div");
      row.className = "editor-row";
      row.innerHTML = `
        <input value="${escapeAttr(option.label)}" aria-label="Option label" />
        <input type="number" value="${Number(option.price) || 0}" aria-label="Option price" />
        <button type="button" title="Delete">×</button>
      `;
      const [labelInput, priceInput] = row.querySelectorAll("input");
      const deleteBtn = row.querySelector("button");

      labelInput.addEventListener("input", () => {
        data[selectedCategory].groups[groupIndex].options[optionIndex].label = labelInput.value;
        saveData();
        renderForm();
        calculate();
      });

      priceInput.addEventListener("input", () => {
        data[selectedCategory].groups[groupIndex].options[optionIndex].price = Number(priceInput.value) || 0;
        saveData();
        renderForm();
        calculate();
      });

      deleteBtn.addEventListener("click", () => {
        data[selectedCategory].groups[groupIndex].options.splice(optionIndex, 1);
        saveData();
        initSelections();
        renderForm();
        renderAdmin();
        calculate();
      });

      section.appendChild(row);
    });

    const add = document.createElement("div");
    add.className = "add-row";
    add.innerHTML = `
      <input placeholder="New option name" />
      <button type="button" class="primary small">Add</button>
    `;
    const newInput = add.querySelector("input");
    const addBtn = add.querySelector("button");
    addBtn.addEventListener("click", () => {
      const label = newInput.value.trim();
      if (!label) return;
      data[selectedCategory].groups[groupIndex].options.push({ label, price: 0 });
      saveData();
      initSelections();
      renderForm();
      renderAdmin();
      calculate();
    });

    section.appendChild(add);
    editor.appendChild(section);
  });
}


function optionButtonHTML(option) {
  const logo = openerMiniLogo(option.label);
  if (logo) {
    return `<div class="brand-line"><b>${escapeHtml(option.label)}</b>${logo}</div><small>${money(option.price)}</small>`;
  }
  return `<b>${escapeHtml(option.label)}</b><small>${money(option.price)}</small>`;
}

function openerMiniLogo(label) {
  const clean = String(label).toLowerCase();
  if (clean.includes("liftmaster")) return `<span class="mini-logo liftmaster">LiftMaster</span>`;
  if (clean.includes("chamberlain")) return `<span class="mini-logo chamberlain">Chamberlain</span>`;
  return "";
}




function buildCustomerIntro(category) {
  const wrap = document.createElement("section");
  wrap.className = "customer-intro brand-intro brand-showcase";
  const brands = category === "openers"
    ? [["liftmaster", "LiftMaster"], ["chamberlain", "Chamberlain"]]
    : category === "doors"
      ? [["clopay", "Clopay"], ["amarr", "Amarr"]]
      : [["clopay", "Clopay"], ["amarr", "Amarr"]];
  const spring = category === "springs";
  wrap.innerHTML = `
    <div class="showcase-topline">LOCAL GARAGE DOOR SERVICE</div>
    ${spring ? `<div class="warranty-feature"><span class="warranty-mark" aria-hidden="true">✓</span><div><span class="warranty-overline">SPRING REPLACEMENT</span><h2>Lifetime <span>Warranty</span></h2></div></div>`
      : `<h2 class="showcase-title">${category === "openers" ? "Garage Door Openers" : "Garage Doors"}</h2>`}
    <div class="brand-showcase-grid two-brands">
      ${brands.map(([file, name]) => `<div class="brand-tile"><img src="assets/brands/${file}.svg" alt="${name}" width="160" height="60" /></div>`).join("")}
    </div>
    <p class="brand-context">${spring ? "Garage door brands" : "Brands we work with"}<strong class="brands-more">These brands &amp; more</strong></p>
  `;
  return wrap;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("\n", " ");
}

document.querySelectorAll(".product").forEach(btn => {
  btn.addEventListener("click", () => startLogin(btn.dataset.category));
});

document.querySelectorAll(".role").forEach(btn => {
  btn.addEventListener("click", () => setRole(btn.dataset.role));
});

$("loginBtn").addEventListener("click", login);
$("passwordInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

$("backToCategory").addEventListener("click", () => showScreen("categoryScreen"));
$("backToLogin").addEventListener("click", () => showScreen("loginScreen"));
$("logoutBtn").addEventListener("click", () => {
  loggedRole = null;
  selectedCategory = null;
  document.body.classList.remove("tech-mode", "admin-view");
  showScreen("categoryScreen");
});

$("savePasswordsBtn").addEventListener("click", () => {
  passwords.admin = $("adminPassInput").value;
  passwords.tech = $("techPassInput").value;
  savePasswords();
  setTimeout(() => { lastAdminPasswordForSync = passwords.admin; }, 900);
  alert("Passwords saved globally.");
});

$("resetDataBtn").addEventListener("click", () => {
  if (!confirm("Reset all prices/options/passwords back to defaults?")) return;
  data = clone(DEFAULT_DATA);
  normalizeSpringLabels();
  passwords = { ...DEFAULT_PASSWORDS };
  saveData();
  savePasswords();
  initSelections();
  renderForm();
  renderAdmin();
  calculate();
});

$("jumpTotalBtn").addEventListener("click", () => {
  (document.querySelector(".bottom-total") || document.querySelector(".total-pill")).scrollIntoView({ behavior: "smooth", block: "center" });
});


$("closeTools").onclick = () => $("quoteTools").close();
$("quoteTools").addEventListener("close", () => { adjustmentsOpen = false; });
$("quoteTools").addEventListener("click", event => { if (event.target === $("quoteTools")) $("quoteTools").close(); });
$("applyDiscount").onclick = () => {
  const value = Number($("discountValue").value);
  const type = $("discountType").value;
  const current = computeQuote(data[selectedCategory].groups, selections, quantity, quoteExtras, { type: "fixed", value: 0 });
  if (!Number.isFinite(value) || value < 0 || (type === "percent" && value > 100) || (type === "fixed" && value > current.total)) {
    $("toolError").textContent = "Enter a valid discount within the quote total (0–100 for percent).";
    return;
  }
  quoteDiscount = { type, value, presets: [...$("discountPresets").querySelectorAll("input:checked")].map(input => input.dataset.discountId) };
  calculate();
  $("quoteTools").close();
};
$("saveExtra").onclick = () => {
  const label = $("extraLabel").value.trim();
  const price = Number($("extraPrice").value);
  const count = Number($("extraQuantity").value);
  if (!label || !$("extraPrice").value || !Number.isFinite(price) || price < 0 || !Number.isInteger(count) || count < 1 || count > 100) {
    $("toolError").textContent = "Enter a description, a non-negative price and a whole quantity from 1 to 100.";
    return;
  }
  quoteExtras.push({ label, price: Math.round(price * 100) / 100, quantity: count, perUnit: $("extraPerUnit").checked });
  renderExtras();
  calculate();
  $("extraLabel").value = "";
  $("extraPrice").value = "";
  $("extraQuantity").value = "1";
  $("extraPerUnit").checked = false;
  $("quoteTools").close();
};

// Load shared Admin settings from Netlify on page open.
// If the site is opened locally without Netlify Functions, it falls back to the built-in defaults.
loadGlobalSettings();


