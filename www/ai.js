// ============================================================
// AI IMAGE GENERATOR - POLLINATIONS.AI (DIPERBAIKI)
// ============================================================

const aiPromptInput = document.getElementById('aiPromptInput');
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const aiResultArea = document.getElementById('aiResultArea');
const aiResultImage = document.getElementById('aiResultImage');
const aiResultContainer = document.getElementById('aiResultContainer');
const aiDownloadBtn = document.getElementById('aiDownloadBtn');
const aiRegenerateBtn = document.getElementById('aiRegenerateBtn');
const aiCopyBtn = document.getElementById('aiCopyBtn');
const aiStyleSelector = document.getElementById('aiStyleSelector');
const aiHistoryGrid = document.getElementById('aiHistoryGrid');
const aiRandomBtn = document.getElementById('aiRandomBtn');

/*
let aiSelectedStyle = 'photorealistic';

let aiCurrentPrompt = '';

let aiCurrentImageUrl = '';
let aiHistory = [];
let aiIsGenerating = false;
*/
// Load AI history dari localStorage
try {
    const saved = localStorage.getItem('alovera_ai_history');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            aiHistory = parsed;
        }
    }
} catch (e) {
    aiHistory = [];
}

// ============================================================
// RANDOM PROMPTS (Sama seperti gambarai.html)
// ============================================================

/*
const aiRandomPrompts = [
    'A futuristic city floating in the clouds at sunset, photorealistic, 8K',
    'A cozy cabin in a snowy forest with warm lights glowing from the windows, cinematic',
    'A majestic white tiger with icy blue eyes in a mystical forest, fantasy art',
    'An astronaut playing electric guitar on the moon with Earth in the background, digital art',
    'A steampunk airship sailing through golden clouds at dawn, highly detailed',
    'A beautiful mermaid sitting on a rock under the moonlight, oil painting style',
    'A cyberpunk street market in Tokyo at night with neon signs, rain, and reflections',
    'A giant ancient tree with a glowing door in its trunk, surrounded by fireflies',
    'A crystal castle on a floating island above a purple ocean, fantasy, magical atmosphere',
    'A samurai warrior standing in a field of cherry blossoms at sunrise, photorealistic',
    'A dragon made of galaxies and stars coiled around a planet, cosmic art',
    'A vintage coffee shop on a rainy Paris street, warm lighting, cinematic mood',
];
*/
function getAiRandomPrompt() {
    const random = aiRandomPrompts[Math.floor(Math.random() * aiRandomPrompts.length)];
    aiPromptInput.value = random;
    aiPromptInput.focus();
}

// ============================================================
// STYLE SELECTOR
// ============================================================
aiStyleSelector.addEventListener('click', (e) => {
    const chip = e.target.closest('.ai-style-chip');
    if (!chip) return;
    document.querySelectorAll('.ai-style-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    aiSelectedStyle = chip.dataset.style;
});

// ============================================================
// BUILD STYLE PROMPT SUFFIX (Sama seperti gambarai.html)
// ============================================================
function getAiStyleSuffix() {
    const styleMap = {
        'photorealistic': ', photorealistic, highly detailed, 8K, realistic lighting, sharp focus',
        'cinematic': ', cinematic lighting, film grain, anamorphic lens, dramatic atmosphere, movie poster quality',
        'anime': ', anime style, studio ghibli, vibrant colors, clean lines, manga aesthetic',
        'digital-art': ', digital art, trending on artstation, concept art, detailed illustration',
        'oil-painting': ', oil painting on canvas, thick brush strokes, classical art, masterpiece',
        '3d-render': ', 3D render, octane render, unreal engine 5, ray tracing, hyperrealistic CGI',
        'fantasy': ', fantasy art, magical, ethereal, glowing, mythical, enchanting atmosphere',
        'cyberpunk': ', cyberpunk, neon lights, futuristic, blade runner aesthetic, rain, reflections',
    };
    return styleMap[aiSelectedStyle] || '';
}

// ============================================================
// GENERATE IMAGE - METODE SEDERHANA SEPERTI GAMBARAI.HTML
// ============================================================
function generateImageUrl(prompt, style) {
    // Gunakan seed acak untuk variasi
    const seed = Math.floor(Math.random() * 999999);
    // Gunakan prompt + style suffix
    const fullPrompt = prompt + getAiStyleSuffix();
    const encodedPrompt = encodeURIComponent(fullPrompt);
    // Pollinations.ai API - gratis, tanpa API key
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
}

// ============================================================
// PRELOAD IMAGE - DENGAN RETRY DAN TIMEOUT
// ============================================================
function preloadImageWithRetry(url, maxRetries = 3) {
    return new Promise((resolve, reject) => {
        let attempt = 0;
        
        function tryLoad() {
            attempt++;
            const img = new Image();
            let resolved = false;
            
            img.onload = () => {
                if (!resolved) {
                    resolved = true;
                    resolve(img);
                }
            };
            
            img.onerror = () => {
                if (!resolved) {
                    if (attempt < maxRetries) {
                        // Coba lagi setelah delay
                        setTimeout(tryLoad, 1000 * attempt);
                    } else {
                        resolved = true;
                        reject(new Error('Gagal memuat gambar setelah ' + maxRetries + ' percobaan'));
                    }
                }
            };
            
            // Timeout 30 detik per percobaan
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    if (attempt < maxRetries) {
                        setTimeout(tryLoad, 1000 * attempt);
                    } else {
                        reject(new Error('Timeout - server AI sibuk'));
                    }
                }
            }, 30000);
            
            // Mulai loading
            img.src = url;
        }
        
        tryLoad();
    });
}

// ============================================================
// RENDER HISTORY
// ============================================================
function renderAiHistory() {
    if (!aiHistoryGrid) return;
    
    if (aiHistory.length === 0) {
        aiHistoryGrid.innerHTML = `
            <p class="ai-history-empty">Belum ada gambar yang dibuat. Mulailah dengan menulis prompt di atas! </p>
        `;
        return;
    }
    
    const reversed = [...aiHistory].reverse();
    aiHistoryGrid.innerHTML = reversed.map((item, index) => {
        const realIndex = aiHistory.length - 1 - index;
        const promptText = item.prompt || 'Tanpa prompt';
        const displayPrompt = promptText.length > 40 ? promptText.substring(0, 40) + '...' : promptText;
        const imageUrl = item.imageUrl || '';
        
        return `
            <div class="ai-history-item" data-index="${realIndex}" title="${escapeHtml(promptText)}">
                <img src="${imageUrl}" alt="Generated image" loading="lazy" onerror="this.style.display='none'">
                <div class="ai-history-prompt">${escapeHtml(displayPrompt)}</div>
                <button class="ai-history-delete" onclick="deleteAiHistoryItem(${realIndex}, event)" title="Hapus"><i class="fas fa-times"></i></button>
            </div>
        `;
    }).join('');
    
    try {
        localStorage.setItem('alovera_ai_history', JSON.stringify(aiHistory));
    } catch (e) {
        if (aiHistory.length > 20) {
            aiHistory = aiHistory.slice(-20);
            localStorage.setItem('alovera_ai_history', JSON.stringify(aiHistory));
        }
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Delete single history item
function deleteAiHistoryItem(index, event) {
    if (event) event.stopPropagation();
    if (index >= 0 && index < aiHistory.length) {
        aiHistory.splice(index, 1);
        renderAiHistory();
        showNotification('Item riwayat dihapus');
    }
}

// Clear all AI history
function clearAiHistory() {
    if (aiHistory.length === 0) {
        showNotification('Tidak ada riwayat untuk dihapus');
        return;
    }
    if (confirm('Hapus semua riwayat gambar?')) {
        aiHistory = [];
        renderAiHistory();
        showNotification('Semua riwayat dihapus');
    }
}

// Add to history
function addToAiHistory(prompt, style, imageUrl) {
    aiHistory.push({
        prompt: prompt || 'Tanpa prompt',
        style: style || 'photorealistic',
        imageUrl: imageUrl || '',
        timestamp: Date.now()
    });
    if (aiHistory.length > 50) aiHistory = aiHistory.slice(-50);
    renderAiHistory();
}

/*
// Show result
function showAiResult(imageUrl) {
    aiCurrentImageUrl = imageUrl;
    aiResultImage.src = imageUrl;
    aiResultArea.classList.add('visible');
    setTimeout(() => {
        aiResultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}
*/

// ============================================================
// SHOW RESULT - DENGAN SCROLL YANG LEMBUT DAN OFFSET
// ============================================================

function showAiResult(imageUrl) {
    aiCurrentImageUrl = imageUrl;
    aiResultImage.src = imageUrl;
    aiResultArea.classList.add('visible');
    
    // SCROLL YANG LEMBUT DENGAN OFFSET UNTUK HEADER
    setTimeout(() => {
        const resultElement = aiResultArea;
        const headerHeight = document.querySelector('.app-header')?.offsetHeight || 64;
        const elementPosition = resultElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20; // 20px padding tambahan
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }, 100); // Delay agar gambar sempat termuat
}


// ============================================================
// HANDLE GENERATE - UTAMA
// ============================================================
/*
async function handleAiGenerate() {
    if (aiIsGenerating) return;
    
    const prompt = aiPromptInput.value.trim();
    if (!prompt) {
        showNotification('Silakan tulis deskripsi gambar terlebih dahulu');
        aiPromptInput.focus();
        return;
    }
    aiCurrentPrompt = prompt;

    // Disable button & show loading
    aiGenerateBtn.classList.add('loading');
    aiGenerateBtn.disabled = true;
    aiIsGenerating = true;

    try {
        showNotification(' Menghasilkan gambar...');
        
        // Buat URL gambar
        const imageUrl = generateImageUrl(prompt, aiSelectedStyle);
        
        // Preload image dengan retry
        await preloadImageWithRetry(imageUrl, 3);
        
        // Tampilkan hasil
        showAiResult(imageUrl);
        addToAiHistory(prompt, aiSelectedStyle, imageUrl);
        showNotification(' Gambar berhasil dibuat!');
        
    } catch (error) {
        console.error('AI Generate Error:', error);
        showNotification(' Gagal membuat gambar: ' + (error.message || 'Coba lagi nanti'));
    } finally {
        aiGenerateBtn.classList.remove('loading');
        aiGenerateBtn.disabled = false;
        aiIsGenerating = false;
    }
}
*/
// ============================================================
// HANDLE GENERATE - DENGAN SCROLL YANG LEBIH BAIK
// ============================================================

async function handleAiGenerate() {
    if (aiIsGenerating) return;
    
    const prompt = aiPromptInput.value.trim();
    if (!prompt) {
        showNotification('Silakan tulis deskripsi gambar terlebih dahulu');
        aiPromptInput.focus();
        return;
    }
    aiCurrentPrompt = prompt;

    // Disable button & show loading
    aiGenerateBtn.classList.add('loading');
    aiGenerateBtn.disabled = true;
    aiIsGenerating = true;

    try {
        showNotification(' Menghasilkan gambar...');
        
        // Buat URL gambar
        const imageUrl = generateImageUrl(prompt, aiSelectedStyle);
        
        // Preload image dengan retry
        await preloadImageWithRetry(imageUrl, 3);
        
        // Tampilkan hasil
        showAiResult(imageUrl);
        addToAiHistory(prompt, aiSelectedStyle, imageUrl);
        showNotification(' Gambar berhasil dibuat!', 'success');
        
    } catch (error) {
        console.error('AI Generate Error:', error);
        showNotification(' Gagal membuat gambar: ' + (error.message || 'Coba lagi nanti'), 'error');
    } finally {
        aiGenerateBtn.classList.remove('loading');
        aiGenerateBtn.disabled = false;
        aiIsGenerating = false;
    }
}



// ============================================================
// DOWNLOAD IMAGE - TANPA KELUAR WEBSITE
// ============================================================
async function aiDownloadImage(url, filename = 'alovera-ai-image.png') {
    if (!url) {
        showNotification('Tidak ada gambar untuk diunduh');
        return;
    }
    
    const btn = aiDownloadBtn;
    btn.classList.add('downloading');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span class="btn-spinner"></span><span class="btn-text-download">Mengunduh...</span>';
    
    try {
        showNotification(' Menyiapkan unduhan...');
        const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
        if (!response.ok) throw new Error('Gagal mengunduh');
        const blob = await response.blob();
        if (blob.size === 0) throw new Error('File kosong');
        
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        showNotification('Gambar berhasil diunduh!');
    } catch (e) {
        console.error('Download error:', e);
        // Fallback: buka di tab baru
        window.open(url, '_blank');
        showNotification(' Gambar dibuka di tab baru untuk diunduh.');
    } finally {
        btn.classList.remove('downloading');
        btn.innerHTML = originalHtml;
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
aiGenerateBtn.addEventListener('click', handleAiGenerate);

aiPromptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleAiGenerate();
    }
});

aiRandomBtn.addEventListener('click', getAiRandomPrompt);

aiDownloadBtn.addEventListener('click', function() {
    if (aiCurrentImageUrl) {
        aiDownloadImage(aiCurrentImageUrl, `alovera-ai-${Date.now()}.png`);
    } else {
        showNotification('Tidak ada gambar untuk diunduh');
    }
});

aiRegenerateBtn.addEventListener('click', () => {
    if (aiCurrentPrompt) {
        aiPromptInput.value = aiCurrentPrompt;
        handleAiGenerate();
    } else {
        handleAiGenerate();
    }
});

aiCopyBtn.addEventListener('click', () => {
    if (aiCurrentPrompt) {
        navigator.clipboard.writeText(aiCurrentPrompt).then(() => {
            showNotification(' Prompt disalin ke clipboard!');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = aiCurrentPrompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification(' Prompt disalin ke clipboard!');
        });
    } else {
        showNotification('Tidak ada prompt untuk disalin');
    }
});

// AI Lightbox
aiResultContainer.addEventListener('click', () => {
    if (aiCurrentImageUrl) {
        const lightbox = document.getElementById('aiLightbox');
        const lightboxImage = document.getElementById('aiLightboxImage');
        if (lightbox && lightboxImage) {
            lightboxImage.src = aiCurrentImageUrl;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
});

// ============================================================
// AI LIGHTBOX
// ============================================================
const aiLightbox = document.getElementById('aiLightbox');
const aiLightboxImage = document.getElementById('aiLightboxImage');
const aiLightboxClose = document.getElementById('aiLightboxClose');
const aiLightboxDownload = document.getElementById('aiLightboxDownload');

aiLightboxClose.addEventListener('click', () => {
    aiLightbox.classList.remove('active');
    document.body.style.overflow = '';
});

aiLightbox.addEventListener('click', (e) => {
    if (e.target === aiLightbox) {
        aiLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

aiLightboxDownload.addEventListener('click', () => {
    if (aiCurrentImageUrl) {
        aiDownloadImage(aiCurrentImageUrl, `alovera-ai-hd-${Date.now()}.png`);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aiLightbox.classList.contains('active')) {
        aiLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================================
// HISTORY ITEM CLICK - LOAD FROM HISTORY
// ============================================================
aiHistoryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.ai-history-item');
    if (!item) return;
    const index = parseInt(item.dataset.index);
    if (index >= 0 && index < aiHistory.length) {
        const historyItem = aiHistory[index];
        aiCurrentPrompt = historyItem.prompt;
        aiCurrentImageUrl = historyItem.imageUrl;
        aiSelectedStyle = historyItem.style || 'photorealistic';
        aiPromptInput.value = historyItem.prompt;
        
        // Update style chip
        document.querySelectorAll('.ai-style-chip').forEach(c => {
            c.classList.remove('active');
            if (c.dataset.style === aiSelectedStyle) c.classList.add('active');
        });
        
        showAiResult(historyItem.imageUrl);
        showNotification(' Gambar dari riwayat dimuat.');
    }
});

// ============================================================
// INIT AI
// ============================================================
renderAiHistory();

// Jika ada history terakhir, set style chip sesuai
if (aiHistory.length > 0) {
    const last = aiHistory[aiHistory.length - 1];
    if (last && last.style) {
        aiSelectedStyle = last.style;
        document.querySelectorAll('.ai-style-chip').forEach(c => {
            c.classList.remove('active');
            if (c.dataset.style === aiSelectedStyle) c.classList.add('active');
        });
    }
}

console.log('🚀 AI Image Generator siap digunakan!');
console.log('✨ Didukung oleh Pollinations.ai (gratis, tanpa API key)');
console.log('📝 Tulis prompt, pilih style, lalu klik Generate!');