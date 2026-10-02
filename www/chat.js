// ============================================================
// ALOVERA AI CHAT - Home AI Hub (Revisi - Pakai Lang JSON)
// Session-only chat (hilang saat tutup browser)
// ============================================================

// ============================================================
// STATE
// ============================================================
let aloveraChatMessages = [];
let aloveraIsProcessing = false;
let aloveraUploadedImage = null;
let aloveraUploadFileName = '';
let aloveraUploadFileSize = 0;

// Data bahasa (di-load dari lang/*.json)
let aloveraSinonimData = {};
let aloveraJawabanData = {};
let aloveraUnknownData = [];
let aloveraUiTexts = {};
let aloveraCurrentLang = 'id';

// ============================================================
// KONFIGURASI
// ============================================================
const ALOVERA_REMOVE_BG_KEY = 'gn2RpYgMjpc16qM1DLaJXCy1';
const ALOVERA_GOOGLE_CSE_KEY = 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY';
const ALOVERA_GOOGLE_CSE_CX = '90b13aeccde09420f';

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initAloveraChat();
    loadAloveraLanguage(aloveraCurrentLang);
    loadSiaranTerkini();
});

function initAloveraChat() {
    const input = document.getElementById('aiChatInput');
    if (!input) return;
    
    // Auto-resize textarea
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Enter untuk kirim
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAiSend();
        }
    });
    
    // FOCUS → aktifkan mode chat-focused (berita hilang)
    input.addEventListener('focus', function() {
        const wrapper = document.getElementById('homeAiWrapper');
        if (wrapper) wrapper.classList.add('chat-focused');
    });
    
    // BLUR → kembalikan berita (dengan delay untuk klik tombol)
    input.addEventListener('blur', function() {
        setTimeout(() => {
            const wrapper = document.getElementById('homeAiWrapper');
            // Cek apakah focus masih di dalam chat area
            const activeEl = document.activeElement;
            const chatContainer = document.getElementById('chatHubContainer');
            if (wrapper && (!activeEl || !chatContainer || !chatContainer.contains(activeEl))) {
                wrapper.classList.remove('chat-focused');
            }
        }, 200);
    });
    
    // Close tools dropdown saat klik di luar
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('aiToolsDropdown');
        const btn = document.getElementById('aiToolsBtn');
        if (dropdown && !dropdown.contains(e.target) && btn && !btn.contains(e.target)) {
            dropdown.classList.remove('active');
            btn.classList.remove('active');
        }
    });
    
    // Juga aktifkan chat-focused jika user mulai mengetik
    input.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            const wrapper = document.getElementById('homeAiWrapper');
            if (wrapper) wrapper.classList.add('chat-focused');
        }
    });
}

// ============================================================
// LOAD LANGUAGE DARI LANG/*.JSON
// ============================================================
async function loadAloveraLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // Simpan data
        aloveraSinonimData = data.sinonim || {};
        aloveraJawabanData = data.kategoriJawaban || {};
        aloveraUnknownData = data.unknown_responses || [];
        aloveraUiTexts = data.ui || {};
        aloveraCurrentLang = lang;
        
        // Update UI text
        updateAloveraUITexts();
        
        // Simpan preferensi
        try { localStorage.setItem('alovera_ai_lang', lang); } catch(e) {}
        
        console.log(`✅ Language loaded: ${lang}`);
        
    } catch (error) {
        console.error('❌ Gagal load language:', error);
        // Fallback jika file JSON tidak ditemukan
        if (aloveraUnknownData.length === 0) {
            aloveraUnknownData = ['Maaf, saya belum mengerti. Bisa dijelaskan lagi?'];
        }
    }
}

window.loadAloveraLanguage = loadAloveraLanguage;

// ============================================================
// UPDATE UI TEXTS DARI JSON
// ============================================================
function updateAloveraUITexts() {
    const t = aloveraUiTexts;
    
    // Update semua elemen dengan data-i18n
    document.querySelectorAll('#homePage [data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined && t[key] !== null) {
            el.textContent = t[key];
        }
    });
    
    // Update placeholder
    document.querySelectorAll('#homePage [data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined && t[key] !== null) {
            el.placeholder = t[key];
        }
    });
    
    // Update suggestion chips (yang di dalam <span>)
    const s1 = document.querySelector('#aiSuggestions .ai-suggestion-chip:nth-child(1) span');
    const s2 = document.querySelector('#aiSuggestions .ai-suggestion-chip:nth-child(2) span');
    const s3 = document.querySelector('#aiSuggestions .ai-suggestion-chip:nth-child(3) span');
    if (s1 && t.suggestion1) s1.textContent = t.suggestion1;
    if (s2 && t.suggestion2) s2.textContent = t.suggestion2;
    if (s3 && t.suggestion3) s3.textContent = t.suggestion3;
}

// ============================================================
// START NEW CHAT (tombol AI di header)
// ============================================================
function startNewAiChat() {
    // Reset state
    aloveraChatMessages = [];
    aloveraIsProcessing = false;
    aloveraUploadedImage = null;
    aloveraUploadFileName = '';
    aloveraUploadFileSize = 0;
    
    // Clear UI
    const messagesArea = document.getElementById('aiChatMessages');
    const welcomeScreen = document.getElementById('aiWelcomeScreen');
    const uploadPreview = document.getElementById('aiUploadPreview');
    const input = document.getElementById('aiChatInput');
    const wrapper = document.getElementById('homeAiWrapper');
    
    if (messagesArea) {
        messagesArea.innerHTML = '';
        messagesArea.style.display = 'none';
    }
    if (welcomeScreen) welcomeScreen.style.display = 'flex';
    if (uploadPreview) uploadPreview.style.display = 'none';
    if (input) input.value = '';
    if (wrapper) wrapper.classList.remove('chat-focused');
    
    // Navigate ke home
    if (typeof navigateTo === 'function') {
        navigateTo('home');
    }
    
    setTimeout(() => {
        if (input) input.focus();
    }, 300);
    
    if (typeof showNotification === 'function') {
        showNotification('Percakapan baru siap', 'success');
    }
}

window.startNewAiChat = startNewAiChat;

// ============================================================
// SUGGESTION
// ============================================================
function useAiSuggestion(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = text;
        input.focus();
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }
}

window.useAiSuggestion = useAiSuggestion;

// ============================================================
// TOOLS DROPDOWN
// ============================================================
function toggleAiTools(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('aiToolsDropdown');
    const btn = document.getElementById('aiToolsBtn');
    if (dropdown && btn) {
        dropdown.classList.toggle('active');
        btn.classList.toggle('active');
    }
}

window.toggleAiTools = toggleAiTools;

// ============================================================
// HANDLE SEND
// ============================================================
async function handleAiSend() {
    if (aloveraIsProcessing) return;
    
    const input = document.getElementById('aiChatInput');
    if (!input) return;
    
    const text = input.value.trim();
    
    if (!text && !aloveraUploadedImage) {
        if (typeof showNotification === 'function') {
            showNotification('Ketik pesan atau upload gambar dulu', 'warning');
        }
        return;
    }
    
    // Cek search
    if (text && isAloveraSearchRequest(text)) {
        await performAloveraGoogleSearch(text);
        input.value = '';
        input.style.height = 'auto';
        return;
    }
    
    // Cek upload
    if (aloveraUploadedImage) {
        addAloveraMessage('user', text || 'Upload gambar', { image: aloveraUploadedImage });
        const imgUrl = aloveraUploadedImage;
        clearAiUpload();
        addAloveraMessage('ai', 'Berikut gambar yang Anda upload:', {
            isImage: true,
            imageUrl: imgUrl,
            prompt: text || '📷 Gambar yang diupload'
        });
        input.value = '';
        input.style.height = 'auto';
        return;
    }
    
    // Kirim pesan
    addAloveraMessage('user', text);
    input.value = '';
    input.style.height = 'auto';
    showAloveraMessagesArea();
    
    aloveraIsProcessing = true;
    const sendBtn = document.getElementById('aiSendBtn');
    if (sendBtn) sendBtn.disabled = true;
    
    const typingEl = showAloveraTyping();
    
    try {
        // Cek gambar
        if (isAloveraImageRequest(text)) {
            const imgPrompt = extractAloveraImagePrompt(text);
            const imgUrl = await generateAloveraImage(imgPrompt);
            removeAloveraTyping(typingEl);
            addAloveraMessage('ai', `Berikut gambar: **${imgPrompt}**`, {
                isImage: true, imageUrl: imgUrl, prompt: imgPrompt
            });
        } else {
            // Keyword matching dari lang/*.json
            const jawaban = getAloveraKeywordResponse(text);
            setTimeout(() => {
                removeAloveraTyping(typingEl);
                addAloveraMessage('ai', jawaban);
            }, 500);
        }
    } catch (e) {
        removeAloveraTyping(typingEl);
        addAloveraMessage('ai', 'Maaf, terjadi kesalahan. Coba lagi ya.', { isError: true });
    } finally {
        aloveraIsProcessing = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
    }
}

window.handleAiSend = handleAiSend;

// ============================================================
// KEYWORD MATCHING (sesuai sistem NexaAI)
// ============================================================
function getAloveraKeywordResponse(text) {
    const lower = text.toLowerCase().trim();
    const kataTerpisah = lower.split(/\s+/);
    
    // Cari kategori yang cocok
    let kategoriCocok = [];
    
    for (let kategori in aloveraSinonimData) {
        const sinonimList = aloveraSinonimData[kategori];
        if (!Array.isArray(sinonimList)) continue;
        
        // Cek apakah ada kata yang cocok
        const cocok = kataTerpisah.some(kata => sinonimList.includes(kata));
        if (cocok) kategoriCocok.push(kategori);
    }
    
    if (kategoriCocok.length > 0) {
        const jawabanGabungan = kategoriCocok.map(kat => {
            const pilihan = aloveraJawabanData[kat] || [];
            if (!Array.isArray(pilihan) || pilihan.length === 0) return '';
            return pilihan[Math.floor(Math.random() * pilihan.length)];
        }).filter(Boolean).join(' ');
        
        if (jawabanGabungan) return jawabanGabungan;
    }
    
    // Fallback: unknown responses
    if (aloveraUnknownData.length > 0) {
        return aloveraUnknownData[Math.floor(Math.random() * aloveraUnknownData.length)];
    }
    
    return 'Hmm... saya belum mengerti. Bisa dijelaskan lagi?';
}

// ============================================================
// DETEKSI PERMINTAAN
// ============================================================
function isAloveraSearchRequest(text) {
    const lower = text.toLowerCase();
    return /cari|search|google|telusuri|apa itu|siapa itu|dimana|kapan/i.test(lower);
}

function isAloveraImageRequest(text) {
    const lower = text.toLowerCase();
    return /gambar|buatkan gambar|foto|ilustrasi|sketsa|draw|create image/i.test(lower);
}

function extractAloveraImagePrompt(text) {
    const patterns = [
        /(?:buatkan|buat|bikinin|tolong|coba)\s*gambar\s*(?:tentang|mengenai|dari|yang)?\s*(.+)/i,
        /gambar\s*(?:tentang|mengenai|dari|yang)?\s*(.+)/i,
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m && m[1] && m[1].length > 2) return m[1].trim();
    }
    return text.replace(/(buatkan|gambar|foto|ilustrasi)/gi, '').trim() || text.trim();
}

// ============================================================
// GENERATE IMAGE
// ============================================================
async function generateAloveraImage(prompt) {
    const enhanced = prompt + ', highly detailed, photorealistic, 8K';
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhanced)}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error('Gagal memuat gambar'));
        setTimeout(() => reject(new Error('Timeout')), 30000);
    });
}

// ============================================================
// ADD MESSAGE
// ============================================================
function addAloveraMessage(role, content, extra = {}) {
    const messagesArea = document.getElementById('aiChatMessages');
    if (!messagesArea) return;
    
    const msg = { role, content, timestamp: Date.now(), ...extra };
    aloveraChatMessages.push(msg);
    
    const row = createAloveraMessageRow(msg);
    messagesArea.appendChild(row);
    
    showAloveraMessagesArea();
    scrollAloveraToBottom();
}

function createAloveraMessageRow(msg) {
    const row = document.createElement('div');
    row.className = `ai-message-row ${msg.role}`;
    
    let contentHtml = '';
    
    if (msg.isImage) {
        contentHtml = `
            <div style="font-weight:500;margin-bottom:6px;">${escapeAloveraHtml(msg.prompt || '')}</div>
            <img src="${escapeAloveraHtml(msg.imageUrl)}" 
                 onclick="openAloveraLightbox('${escapeAloveraHtml(msg.imageUrl)}')"
                 onerror="this.src='https://via.placeholder.com/300x300/0066cc/fff?text=Error'">
            <div class="ai-image-actions">
                <button class="ai-image-action-btn" onclick="downloadAloveraImage('${escapeAloveraHtml(msg.imageUrl)}')">
                    <i class="fas fa-download"></i> Unduh
                </button>
                <button class="ai-image-action-btn" onclick="processAloveraRemoveBg('${escapeAloveraHtml(msg.imageUrl)}')">
                    <i class="fas fa-magic"></i> Hapus BG
                </button>
                <button class="ai-image-action-btn" onclick="processAloveraEnhance('${escapeAloveraHtml(msg.imageUrl)}')">
                    <i class="fas fa-wand-magic-sparkles"></i> Perjelas
                </button>
            </div>
        `;
    } else if (msg.isError) {
        contentHtml = `<span style="color:#ef4444;">${escapeAloveraHtml(msg.content)}</span>`;
    } else {
        contentHtml = formatAloveraMessage(msg.content);
    }
    
    row.innerHTML = `<div class="ai-message-bubble">${contentHtml}</div>`;
    return row;
}

function showAloveraMessagesArea() {
    const messagesArea = document.getElementById('aiChatMessages');
    const welcomeScreen = document.getElementById('aiWelcomeScreen');
    if (messagesArea) messagesArea.style.display = 'flex';
    if (welcomeScreen) welcomeScreen.style.display = 'none';
}

function showAloveraTyping() {
    const messagesArea = document.getElementById('aiChatMessages');
    if (!messagesArea) return null;
    
    const row = document.createElement('div');
    row.className = 'ai-message-row ai';
    row.id = 'aloveraTypingIndicator';
    row.innerHTML = `
        <div class="ai-message-bubble">
            <div class="ai-typing"><span></span><span></span><span></span></div>
        </div>
    `;
    
    showAloveraMessagesArea();
    messagesArea.appendChild(row);
    scrollAloveraToBottom();
    return row;
}

function removeAloveraTyping(el) {
    if (el && el.parentNode) el.remove();
    else document.getElementById('aloveraTypingIndicator')?.remove();
}

function scrollAloveraToBottom() {
    const messagesArea = document.getElementById('aiChatMessages');
    if (messagesArea) {
        setTimeout(() => {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }, 100);
    }
}

function escapeAloveraHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
}

function formatAloveraMessage(text) {
    if (!text) return '';
    let f = escapeAloveraHtml(text);
    f = f.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    f = f.replace(/\*(.+?)\*/g, '<em>$1</em>');
    f = f.replace(/`([^`]+)`/g, '<code>$1</code>');
    f = f.replace(/\n/g, '<br>');
    return f;
}

// ============================================================
// UPLOAD IMAGE
// ============================================================
function triggerAiUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                aloveraUploadedImage = ev.target.result;
                aloveraUploadFileName = file.name;
                aloveraUploadFileSize = file.size;
                
                const preview = document.getElementById('aiUploadPreview');
                const previewImg = document.getElementById('aiPreviewImage');
                const previewName = document.getElementById('aiPreviewName');
                const previewSize = document.getElementById('aiPreviewSize');
                
                if (previewImg) previewImg.src = aloveraUploadedImage;
                if (previewName) previewName.textContent = file.name;
                if (previewSize) previewSize.textContent = formatAloveraFileSize(file.size);
                if (preview) preview.style.display = 'flex';
                
                document.getElementById('aiToolsDropdown')?.classList.remove('active');
                document.getElementById('aiToolsBtn')?.classList.remove('active');
                
                if (typeof showNotification === 'function') {
                    showNotification('Gambar siap dikirim', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

window.triggerAiUpload = triggerAiUpload;

function clearAiUpload() {
    aloveraUploadedImage = null;
    aloveraUploadFileName = '';
    aloveraUploadFileSize = 0;
    
    const preview = document.getElementById('aiUploadPreview');
    const previewImg = document.getElementById('aiPreviewImage');
    if (preview) preview.style.display = 'none';
    if (previewImg) previewImg.src = '';
}

window.clearAiUpload = clearAiUpload;

function formatAloveraFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// ============================================================
// REMOVE BACKGROUND
// ============================================================
function triggerAiRemoveBg() {
    triggerAiUpload();
    setTimeout(() => {
        if (aloveraUploadedImage) {
            processAloveraRemoveBg(aloveraUploadedImage);
        }
    }, 500);
}

function triggerAiEnhance() {
    triggerAiUpload();
    setTimeout(() => {
        if (aloveraUploadedImage) {
            processAloveraEnhance(aloveraUploadedImage);
        }
    }, 500);
}


/*
async function processAloveraRemoveBg(imageUrl) {
    if (typeof showNotification === 'function') {
        showNotification('Menghapus background...', 'info');
    }
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image_file', blob, 'image.png');
        formData.append('size', 'auto');
        
        const result = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': ALOVERA_REMOVE_BG_KEY },
            body: formData
        });
        
        if (!result.ok) throw new Error('Gagal menghapus background');
        
        const blobResult = await result.blob();
        const url = URL.createObjectURL(blobResult);
        
        clearAiUpload();
        addAloveraMessage('ai', 'Hasil hapus background:', {
            isImage: true, imageUrl: url, prompt: '🪄 Background dihapus'
        });
        
        if (typeof showNotification === 'function') {
            showNotification('Background berhasil dihapus', 'success');
        }
    } catch (e) {
        console.error('Remove BG error:', e);
        if (typeof showNotification === 'function') {
            showNotification('Gagal menghapus background', 'error');
        }
    }
}
*/
async function processAloveraRemoveBg(imageUrl) {
    // Cari tombol yang diklik
    const btn = event?.target?.closest?.('.ai-image-action-btn');
    const originalHTML = btn ? btn.innerHTML : '';
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    }
    
    // Tampilkan typing indicator di chat
    const typingEl = showAloveraTyping();
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image_file', blob, 'image.png');
        formData.append('size', 'auto');
        
        const result = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': ALOVERA_REMOVE_BG_KEY },
            body: formData
        });
        
        if (!result.ok) throw new Error('Gagal menghapus background');
        
        const blobResult = await result.blob();
        const url = URL.createObjectURL(blobResult);
        
        // Hapus typing indicator
        removeAloveraTyping(typingEl);
        
        clearAiUpload();
        addAloveraMessage('ai', 'Hasil hapus background:', {
            isImage: true, imageUrl: url, prompt: '🪄 Background dihapus'
        });
        
        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil';
            setTimeout(() => {
                btn.classList.remove('success');
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Background berhasil dihapus', 'success');
        }
    } catch (e) {
        console.error('Remove BG error:', e);
        
        // Hapus typing indicator
        removeAloveraTyping(typingEl);
        
        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('error');
            btn.innerHTML = '<i class="fas fa-times"></i> Gagal';
            setTimeout(() => {
                btn.classList.remove('error');
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Gagal menghapus background', 'error');
        }
    }
}




window.processAloveraRemoveBg = processAloveraRemoveBg;

// ============================================================
// ENHANCE IMAGE
// ============================================================

/*
async function processAloveraEnhance(imageUrl) {
    if (typeof showNotification === 'function') {
        showNotification('Memperjelas gambar...', 'info');
    }
    
    try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 1.5;
        canvas.height = img.height * 1.5;
        const ctx = canvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i]     = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        ctx.putImageData(imageData, 0, 0);
        
        const enhancedUrl = canvas.toDataURL('image/png');
        
        clearAiUpload();
        addAloveraMessage('ai', 'Hasil perjelas gambar:', {
            isImage: true, imageUrl: enhancedUrl, prompt: '✨ Gambar diperjelas'
        });
        
        if (typeof showNotification === 'function') {
            showNotification('Gambar berhasil diperjelas', 'success');
        }
    } catch (e) {
        console.error('Enhance error:', e);
        if (typeof showNotification === 'function') {
            showNotification('Gagal memperjelas gambar', 'error');
        }
    }
}
*/


async function processAloveraEnhance(imageUrl) {
    // Cari tombol yang diklik
    const btn = event?.target?.closest?.('.ai-image-action-btn');
    const originalHTML = btn ? btn.innerHTML : '';
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    }
    
    // Tampilkan typing indicator
    const typingEl = showAloveraTyping();
    
    try {
        // Delay kecil untuk efek loading yang terlihat (meski prosesnya cepat)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 1.5;
        canvas.height = img.height * 1.5;
        const ctx = canvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i]     = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        ctx.putImageData(imageData, 0, 0);
        
        const enhancedUrl = canvas.toDataURL('image/png');
        
        // Hapus typing
        removeAloveraTyping(typingEl);
        
        clearAiUpload();
        addAloveraMessage('ai', 'Hasil perjelas gambar:', {
            isImage: true, imageUrl: enhancedUrl, prompt: '✨ Gambar diperjelas'
        });
        
        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil';
            setTimeout(() => {
                btn.classList.remove('success');
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Gambar berhasil diperjelas', 'success');
        }
    } catch (e) {
        console.error('Enhance error:', e);
        
        // Hapus typing
        removeAloveraTyping(typingEl);
        
        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('error');
            btn.innerHTML = '<i class="fas fa-times"></i> Gagal';
            setTimeout(() => {
                btn.classList.remove('error');
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Gagal memperjelas gambar', 'error');
        }
    }
}



window.processAloveraEnhance = processAloveraEnhance;


// ============================================================
// GOOGLE SEARCH - Trigger dari Chat AI
// ============================================================
function triggerAiGoogleSearch() {
    const input = document.getElementById('aiChatInput');
    if (input) {
        const text = input.value.trim();
        if (!text) {
            if (typeof showNotification === 'function') {
                showNotification('Ketik kata kunci pencarian dulu', 'warning');
            }
            return;
        }
        performAloveraGoogleSearch(text);
    }
    document.getElementById('aiToolsDropdown')?.classList.remove('active');
    document.getElementById('aiToolsBtn')?.classList.remove('active');
}

window.triggerAiGoogleSearch = triggerAiGoogleSearch;

// ============================================================
// GOOGLE SEARCH dari Chat AI - Pakai Modal News CSE
// ============================================================
function performAloveraGoogleSearch(query) {
    if (!query || !query.trim()) return;
    
    const cleanQuery = query.trim();
    
    // Tampilkan pesan di chat
    showAloveraMessagesArea();
    addAloveraMessage('user', `🔍 ${cleanQuery}`);
    
    // Pakai modal news CSE yang sama
    const modal = document.getElementById('newsCseModal');
    
    if (modal) {
        // Buka modal CSE
        openNewsCseModal(cleanQuery);
        addAloveraMessage('ai', `Mencari "${cleanQuery}" di Google... Lihat hasilnya di popup yang terbuka.`);
    } else {
        // Fallback kalau modal tidak ada
        addAloveraMessage('ai', `Buka Google: https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`);
    }
}

// Helper: buka modal CSE (dipakai chat & news)
function openNewsCseModal(query) {
    const modal = document.getElementById('newsCseModal');
    if (!modal) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        return;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const queryEl = document.getElementById('newsCseQuery');
    if (queryEl) queryEl.textContent = query;
    
    injectNewsCSEQuery(query);
}

window.performAloveraGoogleSearch = performAloveraGoogleSearch;
window.openNewsCseModal = openNewsCseModal;

// ============================================================
// DOWNLOAD & LIGHTBOX
// ============================================================
/*
async function downloadAloveraImage(url, filename = 'alovera-ai.png') {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(blobUrl);
        if (typeof showNotification === 'function') {
            showNotification('Gambar diunduh', 'success');
        }
    } catch (e) {
        window.open(url, '_blank');
    }
}
*/
async function downloadAloveraImage(url, filename = 'alovera-ai.png') {
    // Cari tombol yang diklik
    const btn = event?.target?.closest?.('.ai-image-action-btn');
    const originalHTML = btn ? btn.innerHTML : '';
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengunduh...';
    }
    
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(blobUrl);
        
        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.innerHTML = '<i class="fas fa-check"></i> Terunduh';
            setTimeout(() => {
                btn.classList.remove('success');
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 1500);
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Gambar diunduh', 'success');
        }
    } catch (e) {
        console.error('Download error:', e);
        window.open(url, '_blank');
        
        if (btn) {
            btn.classList.remove('loading');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
        if (typeof showNotification === 'function') {
            showNotification('Dibuka di tab baru', 'info');
        }
    }
}




window.downloadAloveraImage = downloadAloveraImage;

/*
function openAloveraLightbox(url) {
    const lightbox = document.getElementById('aiLightbox');
    const img = document.getElementById('aiLightboxImage');
    if (lightbox && img) {
        img.src = url;
        lightbox.classList.add('active');
    } else {
        window.open(url, '_blank');
    }
}
*/
// ============================================================
// LIGHTBOX - Buka, Tutup, Download
// ============================================================
function openAloveraLightbox(url) {
    const lightbox = document.getElementById('aiLightbox');
    const img = document.getElementById('aiLightboxImage');
    
    if (!lightbox || !img) {
        // Fallback: buka di tab baru
        window.open(url, '_blank');
        return;
    }
    
    // Set gambar
    img.src = url;
    img.dataset.currentUrl = url; // Simpan URL untuk download
    
    // Tampilkan lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAloveraLightbox() {
    const lightbox = document.getElementById('aiLightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear image setelah animasi close
    setTimeout(() => {
        const img = document.getElementById('aiLightboxImage');
        if (img && !lightbox.classList.contains('active')) {
            img.src = '';
            img.dataset.currentUrl = '';
        }
    }, 300);
}

function closeAloveraLightboxOutside(e) {
    // Hanya close kalau klik langsung di overlay (bukan di img/tombol)
    if (e.target === document.getElementById('aiLightbox')) {
        closeAloveraLightbox();
    }
}

async function downloadAloveraLightboxImage() {
    const img = document.getElementById('aiLightboxImage');
    if (!img || !img.dataset.currentUrl) {
        if (typeof showNotification === 'function') {
            showNotification('Tidak ada gambar untuk diunduh', 'warning');
        }
        return;
    }
    
    const url = img.dataset.currentUrl;
    const btn = document.getElementById('aiLightboxDownload');
    const originalHTML = btn ? btn.innerHTML : '';
    
    // Loading state
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengunduh...';
    }
    
    try {
        // Fetch gambar sebagai blob
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error('Gagal fetch');
        
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Trigger download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `alovera-ai-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Cleanup
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        
        // Success state
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Terunduh';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 1500);
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Gambar berhasil diunduh', 'success');
        }
    } catch (e) {
        console.error('Download error:', e);
        
        // Fallback: buka di tab baru
        window.open(url, '_blank');
        
        if (btn) {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Gambar dibuka di tab baru', 'info');
        }
    }
}

// Expose ke global
window.openAloveraLightbox = openAloveraLightbox;
window.closeAloveraLightbox = closeAloveraLightbox;
window.closeAloveraLightboxOutside = closeAloveraLightboxOutside;
window.downloadAloveraLightboxImage = downloadAloveraLightboxImage;

// ============================================================
// KEYBOARD: ESC untuk Close Lightbox
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('aiLightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            closeAloveraLightbox();
        }
    }
});


window.openAloveraLightbox = openAloveraLightbox;

// ============================================================
// SIARAN TERKINI
// ============================================================
async function loadSiaranTerkini() {
    const track = document.getElementById('siaranTrack');
    if (!track) return;
    
    try {
        const NEWS_API_KEY = (typeof window.NEWS_API_KEY !== 'undefined') 
            ? window.NEWS_API_KEY 
            : 'pub_6b8b47ed35cd4f8fba1703e653088218';
        
        const queries = [
            'teknologi AI indonesia',
            'berita terkini indonesia',
            'inovasi digital',
            'startup indonesia',
            'ekonomi indonesia',
            'bisnis indonesia'
        ];
        
        const query = queries[Math.floor(Math.random() * queries.length)];
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error');
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            track.innerHTML = `<div class="siaran-loading"><i class="fas fa-info-circle"></i> Tidak ada berita</div>`;
            return;
        }
        
        const articles = data.results.slice(0, 10);
        
        const html = articles.map(a => `
            <div class="siaran-item" onclick="window.open('${escapeAloveraHtml(a.link || '#')}', '_blank')">
                <img class="siaran-thumb" 
                     src="${escapeAloveraHtml(a.image_url || 'https://via.placeholder.com/60x60/0066cc/fff?text=News')}"
                     onerror="this.src='https://via.placeholder.com/60x60/0066cc/fff?text=News'">
                <div class="siaran-content">
                    <div class="siaran-news-title">${escapeAloveraHtml(a.title || 'Judul tidak tersedia')}</div>
                    <div class="siaran-source">
                        <span class="dot-live"></span>
                        ${escapeAloveraHtml(a.source_id || 'Berita')}
                    </div>
                </div>
            </div>
        `).join('');
        
        track.innerHTML = html + html;
        
    } catch (e) {
        console.error('Siaran error:', e);
        track.innerHTML = `<div class="siaran-loading"><i class="fas fa-exclamation-circle"></i> Gagal memuat berita</div>`;
    }
}

window.loadSiaranTerkini = loadSiaranTerkini;









// ============================================================
// START REMOVE BG FLOW - Dari Suggestion Chip
// ============================================================
function startRemoveBgFlow() {
    // Buka file picker langsung
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Tampilkan loading
        if (typeof showNotification === 'function') {
            showNotification('Memproses hapus background...', 'info');
        }
        
        // Baca file jadi data URL
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const imageUrl = ev.target.result;
            
            // Tampilkan pesan user
            showAloveraMessagesArea();
            addAloveraMessage('user', '📷 Hapus background: ' + file.name, {
                image: imageUrl
            });
            
            // Proses hapus BG
            await processAloveraRemoveBg(imageUrl);
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// Expose ke global
window.startRemoveBgFlow = startRemoveBgFlow;












// ============================================================
// NEWS GOOGLE SEARCH - Logika Kolom Pencarian di Halaman News
// ============================================================

let newsSearchActive = false;

// Init saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initNewsGoogleSearch();
});

function initNewsGoogleSearch() {
    const input = document.getElementById('newsGoogleSearchInput');
    const clearBtn = document.getElementById('newsGoogleSearchClear');
    
    if (!input) return;
    
    
    
    // Input: show/hide clear button
    input.addEventListener('input', function() {
        if (clearBtn) {
            clearBtn.style.display = this.value.trim().length > 0 ? 'flex' : 'none';
        }
    });
    
    // Enter: trigger search
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                performNewsGoogleSearch(query);
            }
        }
    });
    
    // ESC: clear search
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (this.value.trim()) {
                this.value = '';
                if (clearBtn) clearBtn.style.display = 'none';
            } else {
                clearNewsGoogleSearch();
            }
        }
    });
}

// ============================================================
// PERFORM NEWS GOOGLE SEARCH
// ============================================================


/*
function performNewsGoogleSearch(query) {
    if (!query || !query.trim()) return;
    
    const cleanQuery = query.trim();
    newsSearchActive = true;
    
    // Sembunyikan elemen-elemen News
    const sectionsToHide = [
        'maulid-news-section',      // Cerdas Finansial
        'sticky-search',             // Kategori news
        'section-title',             // "Berita Terkini"
        'news-grid',                 // Grid berita
        'load-more-wrap',            // Load more
        'berita-home-section',       // Berita home (jika ada)
        'maulid-page-wrapper'        // Jika ada
    ];
    
    sectionsToHide.forEach(cls => {
        document.querySelectorAll('#newsPage .' + cls).forEach(el => {
            el.style.display = 'none';
        });
    });
    
    // Tampilkan CSE container
    const cseContainer = document.getElementById('newsCseContainer');
    if (cseContainer) {
        cseContainer.style.display = 'block';
        
        // Set query text
        const queryEl = document.getElementById('newsCseQuery');
        if (queryEl) queryEl.textContent = cleanQuery;
        
        // Inject query ke CSE
        injectQueryToCSE(cleanQuery);
        
        // Scroll ke hasil
        setTimeout(() => {
            cseContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
    
    // Update input value
    const input = document.getElementById('newsGoogleSearchInput');
    if (input) {
        input.value = cleanQuery;
        const clearBtn = document.getElementById('newsGoogleSearchClear');
        if (clearBtn) clearBtn.style.display = 'flex';
    }
}

// ============================================================
// INJECT QUERY KE GOOGLE CSE
// ============================================================
function injectQueryToCSE(query) {
    const cseBody = document.querySelector('#newsCseContainer .news-cse-body');
    if (!cseBody) return;
    
    const encodedQuery = encodeURIComponent(query);
    
    setTimeout(() => {
        // Cara 1: Pakai CSE API
        let handled = false;
        try {
            if (window.google?.search?.cse?.element) {
                // Coba cari input & search button dalam CSE
                const inputEl = cseBody.querySelector('.gsc-input input, .gsc-input-box input');
                if (inputEl) {
                    inputEl.value = query;
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    const searchBtn = cseBody.querySelector('.gsc-search-button-v2, .gsc-search-button');
                    if (searchBtn) {
                        searchBtn.click();
                        handled = true;
                    }
                }
                
                // Alternatif: pakai API langsung
                if (!handled) {
                    const element = google.search.cse.element.getElement('searchresults-only0');
                    if (element && element.execute) {
                        element.execute(query);
                        handled = true;
                    }
                }
            }
        } catch (e) {
            console.warn('CSE API error:', e);
        }
        
        // Cara 2: Fallback dengan hash URL
        if (!handled) {
            try {
                // Set hash agar CSE baca query
                if (window.history?.replaceState) {
                    window.history.replaceState(null, '', `#gsc.q=${encodedQuery}`);
                }
            } catch (e) {
                console.warn('Hash error:', e);
            }
        }
        
        // Cara 3: Fallback akhir - iframe Google Search
        setTimeout(() => {
            const hasResults = cseBody.querySelector('.gsc-results, .gsc-webResult, .gsc-results-wrapper-visible');
            const hasIframe = cseBody.querySelector('iframe');
            
            if (!hasResults && !hasIframe) {
                cseBody.innerHTML = `
                    <div style="text-align:center;padding:40px 20px;">
                        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">
                            Google CSE belum siap. Buka di tab baru?
                        </p>
                        <a href="https://www.google.com/search?q=${encodedQuery}" 
                           target="_blank" 
                           class="news-cse-fallback-btn">
                            <i class="fas fa-external-link-alt"></i>
                            Buka di Google
                        </a>
                    </div>
                `;
            }
        }, 2500);
        
    }, 300);
}

// ============================================================
// CLEAR NEWS GOOGLE SEARCH
// ============================================================
function clearNewsGoogleSearch() {
    newsSearchActive = false;
    
    // Tampilkan kembali elemen-elemen News
    const sectionsToShow = [
        'maulid-news-section',
        'sticky-search',
        'section-title',
        'news-grid',
        'load-more-wrap',
        'berita-home-section',
        'maulid-page-wrapper'
    ];
    
    sectionsToShow.forEach(cls => {
        document.querySelectorAll('#newsPage .' + cls).forEach(el => {
            el.style.display = '';
        });
    });
    
    // Sembunyikan CSE container
    const cseContainer = document.getElementById('newsCseContainer');
    if (cseContainer) {
        cseContainer.style.display = 'none';
    }
    
    // Clear input
    const input = document.getElementById('newsGoogleSearchInput');
    if (input) input.value = '';
    
    // Hide clear button
    const clearBtn = document.getElementById('newsGoogleSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';
    
    // Clear hash
    try {
        if (window.history?.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    } catch (e) {}
    
    // Scroll ke atas
    setTimeout(() => {
        const inputWrap = document.getElementById('newsGoogleSearchWrapper');
        if (inputWrap) {
            inputWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// ============================================================
// EXPOSE KE GLOBAL
// ============================================================
window.performNewsGoogleSearch = performNewsGoogleSearch;
window.clearNewsGoogleSearch = clearNewsGoogleSearch;
window.initNewsGoogleSearch = initNewsGoogleSearch;

*/
// ============================================================
// PERFORM NEWS GOOGLE SEARCH - Mode Modal Popup
// ============================================================
function performNewsGoogleSearch(query) {
    if (!query || !query.trim()) return;
    
    const cleanQuery = query.trim();
    newsSearchActive = true;
    
    // Buka modal
    const modal = document.getElementById('newsCseModal');
    if (!modal) {
        console.warn('Modal news-cse-modal tidak ada');
        // Fallback: buka di tab baru
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`, '_blank');
        return;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set query di header
    const queryEl = document.getElementById('newsCseQuery');
    if (queryEl) queryEl.textContent = cleanQuery;
    
    // Inject query ke CSE
    injectNewsCSEQuery(cleanQuery);
    
    // Update input value (biar tetap terlihat di kolom search)
    const input = document.getElementById('newsGoogleSearchInput');
    if (input) {
        input.value = cleanQuery;
        const clearBtn = document.getElementById('newsGoogleSearchClear');
        if (clearBtn) clearBtn.style.display = 'flex';
    }
    
    // Blur input (tutup keyboard di HP)
    if (input) input.blur();
}

// ============================================================
// INJECT QUERY KE CSE DALAM MODAL
// ============================================================
function injectNewsCSEQuery(query) {
    const modalBody = document.getElementById('newsCseModalBody');
    if (!modalBody) return;
    
    const encodedQuery = encodeURIComponent(query);
    
    // Tunggu modal selesai render
    setTimeout(() => {
        // Cek apakah CSE sudah render
        const hasCSE = modalBody.querySelector('.gsc-control-cse, .gsc-results-wrapper-visible');
        
        // Coba trigger via API
        let handled = false;
        try {
            if (window.google?.search?.cse?.element) {
                // Cari semua elemen CSE
                const elements = document.querySelectorAll('.gsc-input input, .gsc-input-box input');
                elements.forEach(inputEl => {
                    if (inputEl.offsetParent !== null) { // Hanya yang visible
                        inputEl.value = query;
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
                
                // Trigger search button
                const buttons = document.querySelectorAll('.gsc-search-button-v2, .gsc-search-button');
                buttons.forEach(btn => {
                    if (btn.offsetParent !== null) {
                        btn.click();
                        handled = true;
                    }
                });
            }
        } catch (e) {
            console.warn('CSE API error:', e);
        }
        
        // Kalau tidak handled, coba set hash URL
        if (!handled) {
            try {
                if (window.history?.replaceState) {
                    window.history.replaceState(null, '', `#gsc.q=${encodedQuery}`);
                }
            } catch (e) {}
        }
        
        // Fallback terakhir: setelah 3 detik, cek apakah CSE render
        setTimeout(() => {
            const hasResults = modalBody.querySelector('.gsc-results, .gsc-webResult, .gsc-results-wrapper-visible');
            
            if (!hasResults) {
                // CSE belum render → tampilkan fallback
                modalBody.innerHTML = `
                    <div class="news-cse-fallback">
                        <p>Pencarian Google belum siap di sini.</p>
                        <a href="https://www.google.com/search?q=${encodedQuery}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="news-cse-fallback-btn">
                            <i class="fas fa-external-link-alt"></i>
                            Buka di Google
                        </a>
                    </div>
                `;
            }
        }, 3000);
        
    }, 300);
}

// ============================================================
// CLOSE NEWS CSE MODAL
// ============================================================
function closeNewsCseModal() {
    const modal = document.getElementById('newsCseModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    document.body.style.overflow = '';
    
    // Clear hash
    try {
        if (window.history?.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    } catch (e) {}
}

function closeNewsCseOutside(e) {
    // Hanya tutup kalau klik langsung di overlay
    if (e.target === document.getElementById('newsCseModal')) {
        closeNewsCseModal();
    }
}

// ============================================================
// CLEAR NEWS GOOGLE SEARCH - Reset Semua
// ============================================================
function clearNewsGoogleSearch() {
    newsSearchActive = false;
    
    // Tutup modal
    closeNewsCseModal();
    
    // Clear input
    const input = document.getElementById('newsGoogleSearchInput');
    if (input) {
        input.value = '';
        input.blur();
    }
    
    // Hide clear button
    const clearBtn = document.getElementById('newsGoogleSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';
}

// ============================================================
// ESC HANDLER
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('newsCseModal');
        if (modal && modal.classList.contains('active')) {
            closeNewsCseModal();
        }
    }
});

// ============================================================
// EXPOSE
// ============================================================
window.performNewsGoogleSearch = performNewsGoogleSearch;
window.clearNewsGoogleSearch = clearNewsGoogleSearch;
window.closeNewsCseModal = closeNewsCseModal;
window.closeNewsCseOutside = closeNewsCseOutside;
window.initNewsGoogleSearch = initNewsGoogleSearch;


// ============================================================
// RESET SAAT PINDAH HALAMAN
// ============================================================
// Kalau user pindah ke halaman lain, reset search state
document.addEventListener('DOMContentLoaded', function() {
    // Hook navigateTo kalau ada
    if (typeof window.navigateTo === 'function' && !window._newsSearchHooked) {
        window._newsSearchHooked = true;
        const originalNav = window.navigateTo;
        window.navigateTo = function(page) {
            originalNav(page);
            if (page !== 'news' && newsSearchActive) {
                clearNewsGoogleSearch();
            }
        };
    }
});

console.log('✅ News Google Search module loaded!');

