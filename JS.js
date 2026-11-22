document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     1. EFEK NAVBAR SAAT SCROLL & ACTIVE LINK (SCROLLSPY)
     ======================================================================== */
  const navbar = document.getElementById("navbar");
  const backToTopBtn = document.getElementById("back-to-top");
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Tambah bayangan pada navbar saat halaman digulir
    if (scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Munculkan tombol Back-to-Top setelah melewati Hero
    if (scrollY > 450) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }

    // Tandai menu navbar sesuai section yang sedang dilihat
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop - 130;
      const sectionHeight = sec.offsetHeight;
      const sectionId = sec.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove("active-link");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active-link");
          }
        });
      }
    });
  });

  // Aksi klik tombol Kembali ke Atas
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ========================================================================
     2. FILTER KATALOG INTERAKTIF + PENGHITUNG JUMLAH HEWAN
     ======================================================================== */
  const filterRadios = document.querySelectorAll('input[name="pet-filter"]');
  const petCards = document.querySelectorAll(".pet-card");
  const petCountBadge = document.getElementById("pet-count-badge");

  function filterPets(category) {
    let visibleCount = 0;

    petCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      card.classList.remove("fade-in");

      if (category === "all" || cardCategory === category) {
        card.classList.remove("is-hidden");
        // Memicu ulang animasi fade-in
        void card.offsetWidth;
        card.classList.add("fade-in");
        visibleCount++;
      } else {
        card.classList.add("is-hidden");
      }
    });

    // Perbarui teks penghitung hewan
    const labelKategori =
      category === "all"
        ? "sahabat siap adopsi"
        : category === "kucing"
        ? "kucing siap adopsi"
        : "anjing siap adopsi";

    petCountBadge.textContent = `Menampilkan ${visibleCount} ${labelKategori}`;
  }

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      filterPets(e.target.value);
    });
  });

  /* ========================================================================
     3. AUTO-PILIH HEWAN DARI KARTU KATALOG KE FORMULIR
     ======================================================================== */
  const adoptTriggers = document.querySelectorAll(".adopt-trigger");
  const selectHewan = document.getElementById("pilih-hewan");
  const formSection = document.getElementById("form-adopsi");

  adoptTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const chosenPet = btn.getAttribute("data-pet");

      // Set nilai dropdown sesuai hewan yang diklik
      if (chosenPet) {
        selectHewan.value = chosenPet;
        clearError(selectHewan, "err-hewan");
      }

      // Gulir halus ke formulir
      formSection.scrollIntoView({ behavior: "smooth" });

      // Tambahkan efek sorotan pada dropdown setelah gulir selesai
      setTimeout(() => {
        selectHewan.classList.remove("highlight-select");
        void selectHewan.offsetWidth;
        selectHewan.classList.add("highlight-select");
      }, 500);
    });
  });

  /* ========================================================================
     4. PENGHITUNG KARAKTER & VALIDASI FORMULIR REAL-TIME
     ======================================================================== */
  const form = document.getElementById("adoption-form");
  const inputNama = document.getElementById("nama");
  const inputWhatsapp = document.getElementById("whatsapp");
  const textareaAlasan = document.getElementById("alasan");
  const checkKomitmen = document.getElementById("komitmen-check");
  const charCounter = document.getElementById("char-counter");

  // Update penghitung karakter pada alasan adopsi
  textareaAlasan.addEventListener("input", () => {
    const length = textareaAlasan.value.trim().length;
    charCounter.textContent = `${length} / min. 20 karakter`;

    if (length >= 20) {
      charCounter.classList.add("valid");
      clearError(textareaAlasan, "err-alasan");
    } else {
      charCounter.classList.remove("valid");
    }
  });

  function showError(inputEl, errorId, message) {
    if (inputEl) inputEl.classList.add("input-error");
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = message;
  }

  function clearError(inputEl, errorId) {
    if (inputEl) inputEl.classList.remove("input-error");
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = "";
  }

  // Hapus pesan error saat pengguna mulai memperbaiki input
  inputNama.addEventListener("input", () => {
    if (inputNama.value.trim().length >= 3) clearError(inputNama, "err-nama");
  });

  inputWhatsapp.addEventListener("input", () => {
    clearError(inputWhatsapp, "err-whatsapp");
  });

  selectHewan.addEventListener("change", () => {
    if (selectHewan.value) clearError(selectHewan, "err-hewan");
  });

  checkKomitmen.addEventListener("change", () => {
    if (checkKomitmen.checked) clearError(null, "err-komitmen");
  });

  /* ========================================================================
     5. SUBMIT FORMULIR & MODAL RINGKASAN + INTEGRASI WHATSAPP
     ======================================================================== */
  const successModal = document.getElementById("success-modal");
  const modalSummary = document.getElementById("modal-summary");
  const btnWaLanjut = document.getElementById("btn-wa-lanjut");
  const btnModalClose = document.getElementById("btn-modal-close");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    const namaVal = inputNama.value.trim();
    const waVal = inputWhatsapp.value.trim();
    const hewanVal = selectHewan.value;
    const alasanVal = textareaAlasan.value.trim();
    const hunianEl = document.querySelector('input[name="hunian"]:checked');
    const hunianVal = hunianEl ? hunianEl.value : "Rumah Pribadi";

    // Validasi Nama
    if (namaVal.length < 3) {
      showError(inputNama, "err-nama", "Nama lengkap minimal 3 karakter.");
      isValid = false;
    } else {
      clearError(inputNama, "err-nama");
    }

    // Validasi Nomor WhatsApp Indonesia (contoh: 0812... atau +62812...)
    const waClean = waVal.replace(/[\s-]/g, "");
    const waRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
    if (!waRegex.test(waClean)) {
      showError(inputWhatsapp, "err-whatsapp", "Masukkan nomor WhatsApp valid (contoh: 081234567890).");
      isValid = false;
    } else {
      clearError(inputWhatsapp, "err-whatsapp");
    }

    // Validasi Pilihan Hewan
    if (!hewanVal) {
      showError(selectHewan, "err-hewan", "Silakan pilih hewan yang ingin diadopsi.");
      isValid = false;
    } else {
      clearError(selectHewan, "err-hewan");
    }

    // Validasi Alasan
    if (alasanVal.length < 20) {
      showError(textareaAlasan, "err-alasan", "Ceritakan kesiapanmu minimal 20 karakter.");
      isValid = false;
    } else {
      clearError(textareaAlasan, "err-alasan");
    }

    // Validasi Checkbox Komitmen
    if (!checkKomitmen.checked) {
      showError(null, "err-komitmen", "Centang pernyataan komitmen terlebih dahulu.");
      isValid = false;
    } else {
      clearError(null, "err-komitmen");
    }

    if (!isValid) return;

    // Isi ringkasan data ke dalam Modal
    modalSummary.innerHTML = `
      <div class="modal-summary-row">
        <span>Nama Adopter</span>
        <strong>${escapeHTML(namaVal)}</strong>
      </div>
      <div class="modal-summary-row">
        <span>No. WhatsApp</span>
        <strong>${escapeHTML(waVal)}</strong>
      </div>
      <div class="modal-summary-row">
        <span>Hewan Pilihan</span>
        <strong>${escapeHTML(hewanVal)}</strong>
      </div>
      <div class="modal-summary-row">
        <span>Tempat Tinggal</span>
        <strong>${escapeHTML(hunianVal)}</strong>
      </div>
    `;

    // Siapkan tautan pesan otomatis ke WhatsApp Shelter
    const shelterPhone = "6281234567890";
    const pesanWA =
      `Halo RumahAnabul! Saya ingin mengajukan adopsi:\n` +
      `• Nama: ${namaVal}\n` +
      `• No. WA: ${waVal}\n` +
      `• Hewan: ${hewanVal}\n` +
      `• Hunian: ${hunianVal}\n` +
      `• Alasan: ${alasanVal}`;

    btnWaLanjut.href = `https://wa.me/${shelterPhone}?text=${encodeURIComponent(pesanWA)}`;

    // Tampilkan Modal
    successModal.classList.add("open");
    successModal.setAttribute("aria-hidden", "false");

    // Reset formulir setelah berhasil
    form.reset();
    charCounter.textContent = "0 / min. 20 karakter";
    charCounter.classList.remove("valid");
  });

  // Tutup Modal saat klik tombol Tutup atau area luar kotak modal
  function closeModal() {
    successModal.classList.remove("open");
    successModal.setAttribute("aria-hidden", "true");
  }

  btnModalClose.addEventListener("click", closeModal);
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) closeModal();
  });

  // Mencegah injeksi HTML pada tampilan ringkasan
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});