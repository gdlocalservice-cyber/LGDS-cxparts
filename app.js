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
        label: "Side",
        multi: false,
        required: true,
        options: [
          { label: "Left", price: 550 },
          { label: "Right", price: 550 },
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
          { label: "Existing customer discount", price: -200 },
          { label: "Veteran discount", price: -150 },
          { label: "Senior discount", price: -125 }
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
          { label: "Chamberlain 1/2 HP + 6 month warranty", price: 340 },
          { label: "Chamberlain 3/4 HP + 1 year warranty", price: 575 },
          { label: "LiftMaster 8155 + 15 years warranty", price: 1275 },
          { label: "LiftMaster 84504R + 20 years warranty", price: 1645 }
        ]
      },
      {
        key: "rails",
        label: "Rails",
        multi: false,
        required: true,
        options: [
          { label: '7"', price: 165 },
          { label: '8"', price: 225 },
          { label: '9"', price: 345 },
          { label: '10"', price: 375 },
          { label: "No rail", price: 0 }
        ]
      },
      {
        key: "labor",
        label: "Labor",
        multi: false,
        required: true,
        options: [
          { label: "Labor", price: 275 }
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

const $ = (id) => document.getElementById(id);

function money(value) {
  const rounded = Math.round(Number(value) || 0);
  return `$${rounded.toLocaleString()}`;
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
  $("jumpTotalBtn").classList.toggle("hidden", id !== "calculatorScreen");
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
      selections[group.key] = group.options.length ? 0 : null;
    }
  });
  quantity = 1;
}

function startCalculator() {
  initSelections();
  $("calcTitle").textContent = `${data[selectedCategory].title} Calculator`;
  $("roleLabel").textContent = loggedRole === "admin" ? "Admin mode: calculator + editable pricing." : "Technician mode.";
  $("adminPanel").classList.toggle("hidden", loggedRole !== "admin");
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
    const section = document.createElement("section");
    section.className = "group";
    const showOptionPrices = /discount/i.test(group.label) || /discount/i.test(group.key);
    if (showOptionPrices) section.classList.add("price-visible");

    section.innerHTML = `
      <div class="group-title">
        <h3>${escapeHtml(group.label)}</h3>
        <span class="muted">${group.multi ? "Choose any" : "Choose one"}</span>
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
    <input id="qtyInput" type="number" min="1" step="1" value="1" />
  `;
  form.appendChild(qty);

  $("qtyInput").addEventListener("input", () => {
    quantity = Math.max(1, parseInt($("qtyInput").value || "1", 10));
    calculate();
  });

  const bottomTotal = document.createElement("div");
  bottomTotal.className = "bottom-total";
  bottomTotal.innerHTML = `
    <div id="bottomTotalAmount" class="total-number">$0</div>
    <button type="button" class="call-order">CALL & ORDER</button>
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

  if (!document.body.classList.contains("admin-view")) {
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

function calculate() {
  const lines = [];
  let subtotal = 0;

  data[selectedCategory].groups.forEach(group => {
    const selected = selections[group.key];
    const selectedIndexes = Array.isArray(selected) ? selected : [selected];

    selectedIndexes.forEach(index => {
      if (index === null || index === undefined) return;
      const option = group.options[index];
      if (!option) return;
      subtotal += Number(option.price) || 0;
      lines.push({
        group: group.label,
        label: option.label,
        price: Number(option.price) || 0
      });
    });
  });

  const total = subtotal * quantity;
  $("totalAmount").textContent = money(total);
  const bottomTotalEl = $("bottomTotalAmount");
  if (bottomTotalEl) bottomTotalEl.textContent = money(total);

  const summary = $("summaryArea");
  const details = loggedRole === "admin";
  summary.innerHTML = "";

  if (!lines.length) {
    summary.innerHTML = `<p class="muted">Choose options to calculate the total.</p>`;
    return;
  }

  lines.forEach(line => {
    const row = document.createElement("div");
    row.className = "summary-line";
    row.innerHTML = `<span>${escapeHtml(line.group)}: ${escapeHtml(line.label)}</span><span>${details ? money(line.price) : "✓"}</span>`;
    summary.appendChild(row);
  });

  if (quantity > 1) {
    const qtyRow = document.createElement("div");
    qtyRow.className = "summary-line";
    qtyRow.innerHTML = `<span>Quantity</span><span>x${quantity}</span>`;
    summary.appendChild(qtyRow);
  }

  const totalRow = document.createElement("div");
  totalRow.className = "summary-line";
  totalRow.innerHTML = `<span><strong>Final total</strong></span><span>${money(total)}</span>`;
  summary.appendChild(totalRow);
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
  wrap.className = "customer-intro";

  if (category === "springs") {
    wrap.innerHTML = `
      <div class="customer-hero">
        <div class="customer-title">Life Time WARRANTY SPRINGS</div>
      </div>
      <div class="logo-image-wrap">
        <img src="assets/springs-logos.png" alt="Spring brands" />
      </div>
      <div class="spring-copy">
        <p class="big">Our production is made in the U.S.A.</p>
        <p>All springs are manufactured with <strong>high carbon Astm 229 class ii oil-tempered wire.</strong></p>
        <p><strong>The life cycle of 70,000 times</strong> the garage door opens and closes before the spring breaks compared to 10,000 times with other spring brands.</p>
      </div>
      <div class="customer-hero">
        <div class="customer-title">Highest Quality Springs</div>
      </div>
      <div class="diameters-block">
        <div class="diameters-title">Diameters:</div>
        <ul class="diameters-list">
          <li>1.75"</li>
          <li>2"</li>
          <li>2.625"</li>
        </ul>
      </div>
      <div class="customer-hero">
        <div class="customer-title">Life Time WARRANTY SPRINGS</div>
      </div>
    `;
    return wrap;
  }

  if (category === "openers") {
    wrap.innerHTML = `
      <div class="logo-image-wrap">
        <img src="assets/openers-logos.png" alt="Opener brands" />
      </div>
      <div class="spring-copy">
        <p><strong>Expertise and Personalized Service</strong></p>
        <p>At our company, we specialize in garage door openers, offering expert advice and personalized service.</p>
        <p><strong>Professional Installation</strong></p>
        <p>When you purchase a garage door opener from us, you have the option to avail professional installation services.</p>
        <p>All prices listed on our website include labor costs.</p>
      </div>
      <div class="customer-hero">
        <div class="customer-title">Highest Quality Openers</div>
      </div>
      <div class="customer-hero" style="padding-top:0">
        <div class="customer-title" style="color:#4257a8">BUY NOW</div>
      </div>
    `;
    return wrap;
  }

  wrap.innerHTML = `
    <div class="spring-copy">
      <p><strong>Expertise and Personalized Service</strong></p>
      <p>Your premier destination for top-quality garage doors and exceptional service.</p>
      <p><strong>Professional Installation</strong></p>
      <p>When you purchase a garage door from us, you have the option to avail professional installation services.</p>
    </div>
    <div class="customer-hero">
      <div class="customer-title">Life-Time warranty</div>
    </div>
    <div class="customer-hero" style="padding-top:0">
      <div class="customer-title" style="color:#4257a8">BUY NOW</div>
    </div>
    <div class="logo-image-wrap">
      <img src="assets/doors-logos.png" alt="Door brands" />
    </div>
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


// Load shared Admin settings from Netlify on page open.
// If the site is opened locally without Netlify Functions, it falls back to the built-in defaults.
loadGlobalSettings();
