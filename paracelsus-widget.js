/**
 * Paracelsus Wegweiser: einbettbares Chat-Fenster
 * Version 6.0.0
 *
 * Antworten kommen ausschließlich aus der Website-Wissensbasis (data/website-wissen.js),
 * die scripts/website-abgleich.js aus paracelsus-kliniken.de erzeugt.
 *
 * Einbindung (Squarespace: Einstellungen > Erweitert > Code-Injection > Footer):
 *   <script src="https://<eigener-speicherort>/paracelsus-widget.js" defer></script>
 *
 * Optionen als data-Attribute am Skript:
 *   data-clinic="bremen"            Standort vorbelegen (sonst aus der Adresse der Seite erkannt)
 *   data-auto-open="true"           Fenster sofort öffnen
 *   data-voice="true"               Spracheingabe einschalten (läuft in Chrome über Google-Server, deshalb aus)
 *   data-ki-endpoint="https://…/frage"  KI-Schicht zuschalten (siehe server/ki-server.js). Ohne Angabe antwortet der Wegweiser ohne KI.
 */

(function () {
  "use strict";

  if (window.ParacelsusWidgetLoaded) return;
  window.ParacelsusWidgetLoaded = true;

  const currentScript = document.currentScript;
  const baseUrl = currentScript ? currentScript.src.substring(0, currentScript.src.lastIndexOf("/")) : "";

  function loadStyleSheet(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }

  if (baseUrl) {
    loadStyleSheet(`${baseUrl}/src/widget.css`);
  }

  const widgetHtml = `
  <div id="paracelsusWidgetRoot">
    <!-- Floating Launcher Button -->
    <button class="paracelsus-chat-launcher" id="pcLauncherBtn" aria-label="Klinik-Wegweiser öffnen" aria-expanded="false" aria-controls="pcChatDrawer">
      <div class="launcher-icon-wrap">
        <img src="${baseUrl}/assets/bildmarke_p.png" alt="Paracelsus">
      </div>
      <div class="launcher-text-wrap">
        <span class="launcher-label">Wegweiser</span>
        <span class="launcher-sublabel">Klinik und Fachbereich finden</span>
      </div>
    </button>

    <!-- Chat Drawer Window -->
    <div class="paracelsus-chat-window closed" id="pcChatDrawer" role="dialog" aria-modal="false" aria-labelledby="pcHeaderTitle" aria-hidden="true">
      <div class="pc-header">
        <div class="pc-header-brand">
          <div class="pc-brand-p">
            <img src="${baseUrl}/assets/bildmarke_p.png" alt="Paracelsus">
          </div>
          <div class="pc-header-info">
            <h4 id="pcHeaderTitle">Paracelsus Wegweiser</h4>
            <span id="pcHeaderSub">Automatischer Assistent</span>
          </div>
        </div>
        <div class="pc-header-controls">
          <button class="pc-font-btn" id="pcFontBtn" title="Schrift vergrößern">A+</button>
          <button class="pc-close-btn" id="pcCloseBtn" aria-label="Schließen">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div class="pc-safety-banner">
        <div class="pc-safety-left">
          <span class="pc-legal-badge" title="Der Wegweiser zeigt Dir Klinik, Fachbereich und Kontakt. Er berät nicht medizinisch. Bitte gib keine Namen oder Gesundheitsdaten ein.">
            Wegweiser &bull; keine medizinische Beratung
          </span>
        </div>
        <a href="tel:112" class="pc-emergency-badge">🚨 Notruf 112</a>
      </div>

      <div class="pc-messages-area" id="pcDrawerMessages" role="log" aria-live="polite">
        <div class="pc-msg bot">
          Hallo! Ich bin der Wegweiser der Paracelsus Kliniken, ein automatischer Assistent. Ich zeige Dir die passende Klinik, den Fachbereich und den Kontakt.
          <br><br>
          <strong>Worum geht es?</strong>
          <div class="pc-chips">
            <button class="pc-chip" data-query="Ich habe Beschwerden">Ich habe Beschwerden</button>
            <button class="pc-chip" data-query="Termin vereinbaren">Termin vereinbaren</button>
            <button class="pc-chip" data-query="Mein Aufenthalt">Mein Aufenthalt</button>
            <button class="pc-chip" data-query="Alle Standorte">Alle Standorte</button>
          </div>
          <div class="pc-datenhinweis">Bitte gib keine Namen, Geburtsdaten oder Befunde ein.</div>
        </div>
      </div>

      <form class="pc-input-bar" id="pcDrawerForm">
        <label for="pcDrawerInput" class="visually-hidden">Deine Frage an den Paracelsus Wegweiser</label>
        <input 
          type="text" 
          id="pcDrawerInput" 
          placeholder="Anliegen, Fachbereich oder Ort" 
          autocomplete="off"
          autocorrect="off"
          autocapitalize="sentences"
          enterkeyhint="send"
          aria-label="Suchanfrage eingeben"
        >
        <button type="button" class="pc-dock-btn pc-voice-btn" id="pcVoiceBtn" title="Spracheingabe starten" aria-label="Spracheingabe starten">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
        <button type="submit" class="pc-send-btn" aria-label="Senden">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  </div>
  `;

  function ensureDependency(url, globalCheck, callback) {
    if (window[globalCheck]) {
      callback();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function autoDetectClinicFromUrl() {
    try {
      const path = (window.location && window.location.pathname ? window.location.pathname : "").toLowerCase();
      if (/bremen-mvz|mvz-bremen/.test(path)) return "mvz-bremen";
      if (/adorf/.test(path)) return "mvz-adorf";
      if (/kassel-mvz/.test(path)) return "mvz-kassel";
      if (/golzheim|duesseldorf/.test(path)) return "golzheim";
      if (/kassel/.test(path)) return "kassel";
      if (/bremen/.test(path)) return "bremen";
      if (/henstedt|ulzburg/.test(path)) return "henstedt-ulzburg";
      if (/langenhagen/.test(path)) return "langenhagen";
      if (/muenchen/.test(path)) return "muenchen";
      if (/schoeneck|schoneck/.test(path)) return "schoeneck";
    } catch (e) {}
    return null;
  }

  function getInitialWidgetConfig() {
    const globalCfg = (typeof window.ParacelsusConfig === "object" && window.ParacelsusConfig) ? window.ParacelsusConfig : {};
    const ds = (currentScript && currentScript.dataset) ? currentScript.dataset : {};
    return {
      clinic: ds.clinic || globalCfg.clinic || autoDetectClinicFromUrl() || null,
      autoOpen: ds.autoOpen === "true" || globalCfg.autoOpen === true,
      voice: ds.voice === "true" || globalCfg.voice === true,
      voiceAutoSpeak: (ds.voiceAutoSpeak !== "false" && globalCfg.voiceAutoSpeak !== false),
      kiEndpoint: ds.kiEndpoint || globalCfg.kiEndpoint || null
    };
  }

  // Die Wissensbasis (rund 1,2 MB) wird erst geladen, wenn jemand den Wegweiser wirklich benutzt.
  function init() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = widgetHtml;
    document.body.appendChild(wrapper);

    const cfg = getInitialWidgetConfig();
    const launcher = document.getElementById("pcLauncherBtn");
    let zustand = "neu";
    const wartend = [];

    function starte(danach) {
      if (zustand === "bereit") { if (danach) danach(); return; }
      if (danach) wartend.push(danach);
      if (zustand === "laedt") return;
      zustand = "laedt";
      ensureDependency(`${baseUrl}/data/website-wissen.js`, "PARACELSUS_WEBSITE_WISSEN", () => {
        ensureDependency(`${baseUrl}/src/bot-engine.js`, "ParacelsusBotEngine", () => {
          const engine = new window.ParacelsusBotEngine(window.PARACELSUS_WEBSITE_WISSEN);
          if (cfg.clinic) engine.setClinicContext(cfg.clinic);
          launcher.removeEventListener("click", ersterKlick);
          attachListeners(engine, cfg);
          zustand = "bereit";
          wartend.splice(0).forEach((f) => f());
        });
      });
    }

    const ersterKlick = () => starte(() => window.ParacelsusWidget.open());
    launcher.addEventListener("click", ersterKlick);
    launcher.addEventListener("pointerenter", () => starte(), { once: true });
    launcher.addEventListener("focus", () => starte(), { once: true });

    const vorab = {
      open: () => starte(() => window.ParacelsusWidget.open()),
      ask: (q) => starte(() => window.ParacelsusWidget.ask(q)),
      search: (q) => starte(() => window.ParacelsusWidget.ask(q))
    };
    window.ParacelsusWidget = vorab;
    window.ParacelsusNavigator = vorab;

    if (cfg.autoOpen) vorab.open();
  }

  function speakText(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const clean = String(text).replace(/<[^>]*>?/gm, "").replace(/[•*#🔒🧠]/g, "").trim();
    if (!clean) return;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "de-DE";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  }

  function attachListeners(engine, cfg = {}) {
    const drawer = document.getElementById("pcChatDrawer");
    const launcher = document.getElementById("pcLauncherBtn");
    const closeBtn = document.getElementById("pcCloseBtn");
    const form = document.getElementById("pcDrawerForm");
    const input = document.getElementById("pcDrawerInput");
    const messages = document.getElementById("pcDrawerMessages");
    const voiceBtn = document.getElementById("pcVoiceBtn");
    const fontBtn = document.getElementById("pcFontBtn");

    let fontCycleIndex = 0;
    fontBtn.addEventListener("click", () => {
      fontCycleIndex = (fontCycleIndex + 1) % 3;
      drawer.classList.remove("font-size-large", "font-size-xlarge");
      if (fontCycleIndex === 1) {
        drawer.classList.add("font-size-large");
        fontBtn.innerText = "A++";
      } else if (fontCycleIndex === 2) {
        drawer.classList.add("font-size-xlarge");
        fontBtn.innerText = "A";
      } else {
        fontBtn.innerText = "A+";
      }
    });

    if (cfg.kiEndpoint) {
      const sub = document.getElementById("pcHeaderSub");
      if (sub) sub.textContent = "Automatischer Assistent mit KI";
    }

    function toggleChat(force) {
      if (typeof force === "boolean") {
        if (force) drawer.classList.remove("closed");
        else drawer.classList.add("closed");
      } else {
        drawer.classList.toggle("closed");
      }
      const isOpen = !drawer.classList.contains("closed");
      launcher.classList.toggle("chat-open", isOpen);
      launcher.setAttribute("aria-expanded", isOpen ? "true" : "false");
      drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
      if (isOpen) {
        setTimeout(() => input.focus(), 250);
      }
    }

    // Modern Web Guidance: IME-safe enter-to-submit check (prevents premature submit during character conversion)
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (event.isComposing || event.keyCode === 229) {
          return;
        }
      }
    });

    launcher.addEventListener("click", () => toggleChat());
    closeBtn.addEventListener("click", () => toggleChat(false));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !drawer.classList.contains("closed")) {
        toggleChat(false);
      }
    });

    messages.addEventListener("click", (e) => {
      const chip = e.target.closest(".pc-chip");
      if (chip && chip.dataset.query) {
        input.value = chip.dataset.query;
        handleSend();
        return;
      }

      const ttsBtn = e.target.closest(".pc-tts-btn");
      if (ttsBtn && ttsBtn.dataset.tts) {
        speakText(ttsBtn.dataset.tts);
        return;
      }

      const fbBtn = e.target.closest(".pc-feedback-btn");
      if (fbBtn && fbBtn.dataset.rating) {
        if (engine.analytics && engine.analytics.recordFeedback) {
          engine.analytics.recordFeedback(fbBtn.dataset.rating);
        }
        const bar = fbBtn.closest(".pc-feedback-bar");
        if (bar) {
          bar.innerHTML = '<span class="pc-feedback-thanks">Danke für Deine Rückmeldung!</span>';
        }
      }
    });

    function getFeedbackBarHtml() {
      return `
        <div class="pc-feedback-bar">
          <span>War das hilfreich?</span>
          <button type="button" class="pc-feedback-btn" data-rating="ja">Ja</button>
          <span>&bull;</span>
          <button type="button" class="pc-feedback-btn" data-rating="maessig">Mäßig</button>
          <span>&bull;</span>
          <button type="button" class="pc-feedback-btn" data-rating="nein">Nein</button>
        </div>
      `;
    }

    let recognition = null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && cfg.voice) {
      recognition = new SpeechRecognition();
      recognition.lang = "de-DE";
      recognition.interimResults = false;
      recognition.onstart = () => {
        voiceBtn.classList.add("recording");
        input.placeholder = "Ich höre zu …";
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        handleSend(true);
      };
      recognition.onerror = () => {
        voiceBtn.classList.remove("recording");
        input.placeholder = "Anliegen, Fachbereich oder Ort";
      };
      recognition.onend = () => {
        voiceBtn.classList.remove("recording");
        input.placeholder = "Anliegen, Fachbereich oder Ort";
      };

      voiceBtn.addEventListener("click", () => {
        try {
          recognition.start();
        } catch (err) {
          recognition.stop();
        }
      });
    } else {
      voiceBtn.style.display = "none";
    }

    function escapeHtml(str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function formatBotMarkdown(str) {
      return String(str || "")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }

    function renderGroundedMetaHtml(res) {
      if (!res || res.closedWorldBoundary || res.type === "fallback" || res.clinic || !Array.isArray(res.sources) || res.sources.length === 0) return "";
      let meta = `<div class="pc-grounded-meta"><div class="pc-sources-list">`;
      res.sources.forEach(s => {
        if (s && s.url && s.label) {
          meta += `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="pc-source-pill">🔗 ${escapeHtml(s.label)} &nearr;</a>`;
        }
      });
      meta += `</div></div>`;
      return meta;
    }

    function appendMsg(content, type = "bot", extraClass = "") {
      const div = document.createElement("div");
      div.className = `pc-msg ${type} ${extraClass}`.trim();
      if (type === "user") {
        div.textContent = content;
      } else {
        div.innerHTML = content;
      }
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    const verlauf = [];

    // KI-Schicht: nur wenn ein Endpunkt eingetragen ist. Notfall, leere Eingaben und Grenzfälle
    // (medizinische Beratung, fremde Themen) beantwortet immer der lokale Wegweiser, ohne dass etwas gesendet wird.
    function frageKi(text, lokal) {
      const scrub = (typeof window.scrubPII === "function") ? window.scrubPII : (x) => x;
      const ctrl = (typeof AbortController === "function") ? new AbortController() : null;
      const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 9000);
      return fetch(cfg.kiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frage: scrub(text).slice(0, 600), standort: engine.context.lastClinicId || null, verlauf: verlauf.slice(-2) }),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("status " + r.status))))
        .then((d) => {
          clearTimeout(timer);
          if (!d || typeof d.antwort !== "string" || !d.antwort.trim() || d.nichtGefunden) return lokal;
          const st = d.standortId ? engine.standorte.find((s) => s.id === d.standortId) : null;
          if (st) engine.setClinicContext(st.id);
          return {
            type: st ? "match" : "info",
            ki: true,
            title: typeof d.titel === "string" && d.titel ? d.titel : "Paracelsus Wegweiser",
            message: escapeHtml(d.antwort).replace(/\n/g, "<br>"),
            clinic: st || undefined,
            links: Array.isArray(d.links) ? d.links.filter((l) => l && /^https:\/\//.test(l.url || "")).slice(0, 6) : [],
            chips: Array.isArray(d.chips) ? d.chips.slice(0, 5).map(String) : (lokal.chips || []),
            spokenSummary: d.antwort
          };
        })
        .catch(() => { clearTimeout(timer); return lokal; });
    }

    function handleSend(isVoice = false) {
      const text = input.value.trim();
      if (!text) return;

      appendMsg(text, "user");
      input.value = "";

      const lokal = engine.processQuery(text, isVoice);
      const nurLokal = !cfg.kiEndpoint || !lokal || lokal.type === "emergency" || lokal.type === "empty" || lokal.closedWorldBoundary;
      if (nurLokal) {
        setTimeout(() => renderResponse(lokal, isVoice), 250);
      } else {
        appendMsg("…", "bot", "pc-typing");
        frageKi(text, lokal).then((res) => {
          const tipp = messages.querySelector(".pc-typing");
          if (tipp) tipp.remove();
          renderResponse(res, isVoice);
        });
      }
      verlauf.push(((typeof window.scrubPII === "function") ? window.scrubPII(text) : text).slice(0, 300));
    }

    function renderResponse(res, isVoice = false) {
      const spokenText = (res && res.spokenSummary)
        ? res.spokenSummary
        : `${res.title || ""} ${(res.message || "").replace(/[*_]/g, "")}`;

      if (isVoice && cfg.voiceAutoSpeak !== false) {
        speakText(spokenText);
      }

      if (res.type === "emergency") {
        const ttsText = res.spokenSummary || `${res.message}. ${res.guidance}`;
        const html = `
          <div class="pc-emergency-head">🚨 ${escapeHtml(res.alertTitle)}</div>
          <p style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">${escapeHtml(res.message)}</p>
          <p style="font-size: 13px; line-height: 1.4; margin-bottom: 10px;">${escapeHtml(res.guidance)}</p>
          <a href="tel:${escapeHtml(res.emergencyCall)}" class="pc-emergency-call-btn">☎️ ${escapeHtml(res.actionText)}</a>
          <button type="button" class="pc-tts-btn" data-tts="${escapeHtml(ttsText)}">🔊 Vorlesen</button>
          <p style="font-size: 11px; margin-top: 10px; opacity: 0.85;">${escapeHtml(res.secondaryNotice)}</p>
        `;
        appendMsg(html, "bot", "emergency-box");
        return;
      }

      let html = `<strong>${escapeHtml(res.title || "Paracelsus Wegweiser")}</strong><br>${formatBotMarkdown(res.message || "")}`;

      if (res.clinic) {
        const tel = String(res.clinic.phone || "");
        html += `
          <div class="pc-clinic-card">
            <div class="pc-clinic-header">
              <span class="pc-clinic-badge">Standort</span>
              <span class="pc-clinic-name">${escapeHtml(res.clinic.name)}</span>
              <span class="pc-clinic-location">${escapeHtml(res.clinic.address || res.clinic.city)}</span>
            </div>
            <div class="pc-clinic-actions">
              <a href="${escapeHtml(res.clinic.url)}" target="_blank" rel="noopener noreferrer" class="pc-btn-primary">Kontakt &rarr;</a>
              ${tel ? `<a href="tel:${escapeHtml(tel.replace(/[^+\d]/g, ""))}" class="pc-phone-label">${escapeHtml(tel)}</a>` : ""}
              ${res.clinic.mapsUrl ? `<a href="${escapeHtml(res.clinic.mapsUrl)}" target="_blank" rel="noopener noreferrer" class="pc-maps-link" title="Route in Google Maps">Route</a>` : ""}
            </div>
          </div>
        `;
      }

      if (res.links && res.links.length > 0) {
        html += `<ul style="margin-top: 10px; padding-left: 18px; font-size: 13px;">`;
        res.links.forEach(l => {
          html += `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" style="color: var(--gruen); font-weight: 700;">${escapeHtml(l.label)}</a></li>`;
        });
        html += `</ul>`;
      }

      html += renderGroundedMetaHtml(res);
      if (res.ki) html += `<div class="pc-ki-hinweis">Diese Antwort hat eine KI aus den Inhalten unserer Website formuliert.</div>`;

      html += `<button type="button" class="pc-tts-btn" data-tts="${escapeHtml(spokenText)}">🔊 Vorlesen</button>`;

      if (res.chips && res.chips.length > 0) {
        html += `<div class="pc-chips">`;
        res.chips.forEach(c => {
          html += `<button class="pc-chip" data-query="${escapeHtml(c)}">${escapeHtml(c)}</button>`;
        });
        html += `</div>`;
      }

      html += getFeedbackBarHtml();

      appendMsg(html, "bot");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSend();
    });

    if (cfg.autoOpen) {
      toggleChat(true);
    }

    const sdkApi = {
      open: () => toggleChat(true),
      close: () => toggleChat(false),
      toggle: () => toggleChat(),
      search: (q, isVoice = false) => {
        toggleChat(true);
        input.value = q;
        handleSend(isVoice);
      },
      ask: (q, isVoice = false) => {
        toggleChat(true);
        input.value = q;
        handleSend(isVoice);
      },
      setClinicContext: (clinicId) => engine.setClinicContext(clinicId),
      setLanguage: (lang) => engine.setLanguage(lang),
      resetConversation: () => {
        if (typeof engine.resetContext === "function") engine.resetContext();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      },
      getHealthCheck: () => (typeof engine.getHealthCheck === "function" ? engine.getHealthCheck() : { status: "ok" }),
      engine
    };

    window.ParacelsusWidget = sdkApi;
    window.ParacelsusNavigator = sdkApi;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
