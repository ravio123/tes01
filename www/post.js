// ============================================================
// AUTH & PROFIL - SUPABASE
// ============================================================

let currentUser = null;
let userPosts = [];
let isAuthMode = 'login'; // 'login' atau 'register'

// ============================================================
// CHECK AUTH STATUS
// ============================================================
async function checkAuthStatus() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        
        if (session) {
            currentUser = session.user;
            await loadUserProfileData();
            updateUIForLoggedIn();
        } else {
            currentUser = null;
            updateUIForLoggedOut();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        currentUser = null;
        updateUIForLoggedOut();
    }
}

// ============================================================
// LOAD USER PROFILE DATA
// ============================================================

/*
async function loadUserProfileData() {
    if (!currentUser) return;
    
    try {
        // Load profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile load error:', profileError);
        }
        
        if (profile) {
            currentUser.profile = profile;
        } else {
            // Create profile if not exists
            const { data: newProfile, error: createError } = await supabaseClient
                .from('profiles')
                .insert([{
                    user_id: currentUser.id,
                    username: currentUser.email.split('@')[0] || 'user',
                    email: currentUser.email,
                    bio: ''
                }])
                .select()
                .single();
            
            if (!createError && newProfile) {
                currentUser.profile = newProfile;
            }
        }
        
        // Load user posts
        const { data: posts, error: postsError } = await supabaseClient
            .from('posts')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (!postsError) {
            userPosts = posts || [];
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
    } catch (error) {
        console.error('Load profile data error:', error);
    }
}
*/
// ============================================================
// LOAD USER PROFILE DATA - DIPERBAIKI
// ============================================================
/*
async function loadUserProfileData() {
    if (!currentUser) return;
    
    try {
        // Load profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle(); // Gunakan maybeSingle() bukan single()
        
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile load error:', profileError);
        }
        
        if (profile) {
            currentUser.profile = profile;
        } else {
            // Create profile if not exists
            const { data: newProfile, error: createError } = await supabaseClient
                .from('profiles')
                .insert([{
                    user_id: currentUser.id,
                    username: currentUser.email.split('@')[0] || 'user',
                    email: currentUser.email,
                    bio: ''
                }])
                .select()
                .maybeSingle();
            
            if (!createError && newProfile) {
                currentUser.profile = newProfile;
            }
        }
        
        // Load user posts
        const { data: posts, error: postsError } = await supabaseClient
            .from('posts')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (!postsError) {
            userPosts = posts || [];
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
    } catch (error) {
        console.error('Load profile data error:', error);
    }
}
*/



// ============================================================
// AUTH UI UPDATE
// ============================================================
function updateUIForLoggedIn() {
    const nameEl = document.getElementById('profileName');
    const statusEl = document.getElementById('profileStatus');
    const emailEl = document.getElementById('profileEmail');
    const joinPrompt = document.getElementById('joinPrompt');
    const joinBtn = document.querySelector('.btn-join-premium');
    
    if (nameEl) nameEl.textContent = currentUser.profile?.username || currentUser.email.split('@')[0];
    if (statusEl) {
        statusEl.textContent = 'Premium Creator';
        statusEl.className = 'profile-status premium';
    }
    if (emailEl) emailEl.textContent = currentUser.email;
    if (joinPrompt) joinPrompt.style.display = 'none';
    if (joinBtn) {
        joinBtn.innerHTML = '<i class="fas fa-check-circle"></i> Akun Premium Aktif';
        joinBtn.style.background = 'rgba(74,222,128,0.12)';
        joinBtn.style.color = '#4ade80';
        joinBtn.onclick = null;
    }
    
    // Update profile header
    updateProfileUI();
}

function updateUIForLoggedOut() {
    const nameEl = document.getElementById('profileName');
    const statusEl = document.getElementById('profileStatus');
    const emailEl = document.getElementById('profileEmail');
    const joinPrompt = document.getElementById('joinPrompt');
    const joinBtn = document.querySelector('.btn-join-premium');
    
    if (nameEl) nameEl.textContent = 'Pengunjung';
    if (statusEl) {
        statusEl.textContent = 'Belum Bergabung';
        statusEl.className = 'profile-status guest';
    }
    if (emailEl) emailEl.textContent = '-';
    if (joinPrompt) {
        joinPrompt.querySelector('h4').textContent = '✨ Login untuk Berbagi Karya';
        joinPrompt.querySelector('p').textContent = 'Masuk untuk mengupload foto/video dan berinteraksi dengan komunitas.';
        joinPrompt.querySelector('.btn-join-small').style.display = 'inline-flex';
        joinPrompt.querySelector('.btn-join-small').textContent = 'Login Sekarang';
        joinPrompt.querySelector('.btn-join-small').onclick = openAuthModal;
    }
    if (joinBtn) {
        joinBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        joinBtn.style.background = 'var(--accent-color)';
        joinBtn.style.color = 'var(--text-inverse)';
        joinBtn.onclick = openAuthModal;
    }
    
    // Reset profile header
    document.querySelector('.profile-name-display').textContent = 'Pengunjung';
    document.querySelector('.profile-email-display').textContent = '-';
    document.querySelector('.profile-bio').textContent = 'Login untuk membagikan karya Anda';
    document.getElementById('statKarya').textContent = '0';
    document.getElementById('statLikes').textContent = '0';
    
    // Clear posts
    const postsGrid = document.getElementById('profilePostsGrid');
    if (postsGrid) {
        postsGrid.innerHTML = `
            <div class="profile-posts-empty">
                <i class="fas fa-lock"></i>
                <span>Login untuk melihat postingan Anda</span>
            </div>
        `;
    }
}

// ============================================================
// UPDATE PROFIL UI (INSTAGRAM STYLE)
// ============================================================
/*
function updateProfileUI() {
    if (!currentUser) return;
    
    const profile = currentUser.profile || {};
    const avatarLetter = (profile.username || currentUser.email || 'U')[0].toUpperCase();
    
    const avatarEl = document.querySelector('.profile-avatar-large');
    const nameEl = document.querySelector('.profile-name-display');
    const emailEl = document.querySelector('.profile-email-display');
    const bioEl = document.querySelector('.profile-bio');
    const postsCountEl = document.getElementById('statKarya');
    const likesCountEl = document.getElementById('statLikes');
    
    if (avatarEl) {
        avatarEl.textContent = avatarLetter;
        avatarEl.style.background = 'linear-gradient(135deg, #0f3b1a, #1a6b3c)';
        avatarEl.style.color = '#4ade80';
    }
    if (nameEl) nameEl.textContent = profile.username || currentUser.email.split('@')[0];
    if (emailEl) emailEl.textContent = currentUser.email;
    if (bioEl) bioEl.textContent = profile.bio || 'Belum ada bio';
    
    // Count total likes
    let totalLikes = 0;
    userPosts.forEach(post => { totalLikes += post.likes_count || 0; });
    
    if (postsCountEl) postsCountEl.textContent = userPosts.length;
    if (likesCountEl) likesCountEl.textContent = totalLikes;
}
*/

// ============================================================
// RENDER USER POSTS (GRID 3 KOLOM)
// ============================================================
function renderUserPosts() {
    const grid = document.getElementById('profilePostsGrid');
    if (!grid) return;
    
    if (!currentUser || userPosts.length === 0) {
        grid.innerHTML = `
            <div class="profile-posts-empty">
                <i class="fas fa-image"></i>
                <span>Belum ada postingan</span>
                <span style="font-size:12px;color:var(--text-muted);">Klik tombol + untuk upload</span>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = userPosts.map(post => `
        <div class="profile-post-item" onclick="viewPostDetail('${post.id}')">
            ${post.media_type === 'video' 
                ? `<video src="${post.media_url}" muted></video>` 
                : `<img src="${post.media_url}" alt="Post" loading="lazy">`
            }
            <div class="post-overlay">
                <span><i class="fas fa-heart"></i> ${post.likes_count || 0}</span>
            </div>
        </div>
    `).join('');
}

// ============================================================
// AUTH MODAL
// ============================================================
function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('authError').classList.remove('show');
    document.getElementById('authForm').reset();
    setAuthMode('login');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeAuthOutside(e) {
    if (e.target === document.getElementById('authModal')) {
        closeAuthModal();
    }
}

function toggleAuthMode() {
    if (isAuthMode === 'login') {
        setAuthMode('register');
    } else {
        setAuthMode('login');
    }
}

function setAuthMode(mode) {
    isAuthMode = mode;
    const title = document.getElementById('authTitle');
    const subtitle = document.getElementById('authSubtitle');
    const btn = document.getElementById('authBtn');
    const switchText = document.getElementById('authSwitchText');
    const switchLink = document.getElementById('authSwitchLink');
    const bioGroup = document.getElementById('authBioGroup');
    const errorEl = document.getElementById('authError');
    
    errorEl.classList.remove('show');
    
    if (mode === 'login') {
        title.textContent = 'Masuk';
        subtitle.textContent = 'Login untuk mengakses semua fitur';
        btn.textContent = 'Masuk';
        switchText.textContent = 'Belum punya akun?';
        switchLink.textContent = 'Daftar';
        bioGroup.style.display = 'none';
    } else {
        title.textContent = 'Daftar';
        subtitle.textContent = 'Buat akun untuk berbagi karya Anda';
        btn.textContent = 'Daftar';
        switchText.textContent = 'Sudah punya akun?';
        switchLink.textContent = 'Masuk';
        bioGroup.style.display = 'block';
    }
}

// ============================================================
// HANDLE AUTH (Login/Register)
// ============================================================
async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const bio = document.getElementById('authBio').value.trim();
    const errorEl = document.getElementById('authError');
    const btn = document.getElementById('authBtn');
    
    errorEl.classList.remove('show');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    try {
        if (isAuthMode === 'login') {
            // LOGIN
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            showNotification(' Login berhasil!');
            closeAuthModal();
            await checkAuthStatus();
            
        } else {
            // REGISTER
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: email.split('@')[0],
                        bio: bio || ''
                    }
                }
            });
            
            if (error) throw error;
            
            // Create profile
            if (data.user) {
                const { error: profileError } = await supabaseClient
                    .from('profiles')
                    .insert([{
                        user_id: data.user.id,
                        username: email.split('@')[0],
                        email: email,
                        bio: bio || ''
                    }]);
                
                if (profileError) console.error('Profile creation error:', profileError);
            }
            
            showNotification(' Pendaftaran berhasil! Silakan login.');
            setAuthMode('login');
            document.getElementById('authForm').reset();
            btn.innerHTML = 'Masuk';
            btn.disabled = false;
            return;
        }
        
    } catch (error) {
        console.error('Auth error:', error);
        errorEl.textContent = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
        errorEl.classList.add('show');
    }
    
    btn.disabled = false;
    btn.innerHTML = isAuthMode === 'login' ? 'Masuk' : 'Daftar';
}

// ============================================================
// LOGOUT
// ============================================================
async function logoutUser() {
    if (!confirm('Yakin ingin logout?')) return;
    
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        userPosts = [];
        showNotification('Logout berhasil');
        await checkAuthStatus();
        navigateTo('home');
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Gagal logout: ' + error.message);
    }
}

// ============================================================
// UPLOAD MODAL
// ============================================================
function openUploadModal() {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    document.getElementById('uploadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('uploadForm').reset();
    document.getElementById('uploadFilePreview').style.display = 'none';
    document.getElementById('uploadArea').classList.remove('has-file');
    document.getElementById('uploadCharCount').textContent = '0 / 500';
    document.getElementById('uploadCharCount').className = 'char-count';
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeUploadOutside(e) {
    if (e.target === document.getElementById('uploadModal')) {
        closeUploadModal();
    }
}

function updateUploadCharCount(el) {
    const count = el.value.length;
    const charCount = document.getElementById('uploadCharCount');
    charCount.textContent = count + ' / 500';
    charCount.className = 'char-count';
    if (count > 400) charCount.classList.add('warning');
    if (count > 480) charCount.classList.add('danger');
}

function handleUploadFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('Ukuran file terlalu besar. Maksimal 10 MB.');
        input.value = '';
        return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
        showNotification('Format file tidak didukung. Gunakan JPG, PNG, atau MP4.');
        input.value = '';
        return;
    }
    
    
    
    
    
    // Di post.js - handleUploadFileSelect
const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
if (file.type.startsWith('video') && !validVideoTypes.includes(file.type)) {
    showNotification('Format video tidak didukung. Gunakan MP4.', 'error');
    input.value = '';
    return;
}

    
    
    
    const area = document.getElementById('uploadArea');
    area.classList.add('has-file');
    document.getElementById('uploadFilePreview').style.display = 'block';
    document.getElementById('uploadFileName').textContent = file.name;
    document.getElementById('uploadFileSize').textContent = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
}

function removeUploadFile() {
    const input = document.getElementById('uploadFile');
    input.value = '';
    document.getElementById('uploadArea').classList.remove('has-file');
    document.getElementById('uploadFilePreview').style.display = 'none';
}

// ============================================================
// HANDLE UPLOAD POST
// ============================================================

/*
async function handleUploadPost(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const description = document.getElementById('uploadDescription').value.trim();
    const file = document.getElementById('uploadFile').files[0];
    
    if (!file) {
        showNotification('Silakan pilih file terlebih dahulu');
        return;
    }
    
    const btn = document.getElementById('uploadSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
    
    try {
        // Upload file ke Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('posts')
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabaseClient
            .storage
            .from('posts')
            .getPublicUrl(fileName);
        
        const mediaUrl = urlData.publicUrl;
        const mediaType = file.type.startsWith('video') ? 'video' : 'image';
        
        // Save post to database
        const { data: postData, error: postError } = await supabaseClient
            .from('posts')
            .insert([{
                user_id: currentUser.id,
                media_url: mediaUrl,
                media_type: mediaType,
                description: description || '',
                likes_count: 0
            }])
            .select()
            .single();
        
        if (postError) throw postError;
        
        showNotification('✅ Postingan berhasil diupload!');
        closeUploadModal();
        
        // Reload posts
        await loadUserProfileData();
        updateProfileUI();
        renderUserPosts();
        
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('❌ Gagal upload: ' + error.message);
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Posting';
}
*/

// ============================================================
// HANDLE UPLOAD POST - DIPERBAIKI
// ============================================================
async function handleUploadPost(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const description = document.getElementById('uploadDescription').value.trim();
    const file = document.getElementById('uploadFile').files[0];
    
    if (!file) {
        showNotification('Silakan pilih file terlebih dahulu');
        return;
    }
    
    const btn = document.getElementById('uploadSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
    
    try {
        // Upload file ke Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
        
        console.log(' Uploading file:', fileName);
        
        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('posts')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(uploadError.message);
        }
        
        console.log(' File uploaded:', uploadData);
        
        // Get public URL
        const { data: urlData } = supabaseClient
            .storage
            .from('posts')
            .getPublicUrl(fileName);
        
        const mediaUrl = urlData.publicUrl;
        const mediaType = file.type.startsWith('video') ? 'video' : 'image';
        
        console.log('📎 Media URL:', mediaUrl);
        
        // Save post to database
        const { data: postData, error: postError } = await supabaseClient
            .from('posts')
            .insert([{
                user_id: currentUser.id,
                media_url: mediaUrl,
                media_type: mediaType,
                description: description || '',
                likes_count: 0
            }])
            .select()
            .single();
        
        if (postError) {
            console.error('Post insert error:', postError);
            throw new Error(postError.message);
        }
        
        console.log(' Post saved:', postData);
        
        showNotification(' Postingan berhasil diupload!');
        closeUploadModal();
        
        // Reload posts
        await loadUserProfileData();
        updateProfileUI();
        renderUserPosts();
        
        // Refresh feed jika feed aktif
        if (document.getElementById('feedPage')?.classList.contains('active')) {
            feedVideosData = [];
            loadFeedVideosData(true);
        }
        
    } catch (error) {
        console.error(' Upload error:', error);
        showNotification(' Gagal upload: ' + (error.message || 'Terjadi kesalahan'));
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Posting';
}






// ============================================================
// POST DETAIL VIEW (SIMPLE)
// ============================================================
function viewPostDetail(postId) {
    const post = userPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Tampilkan detail sederhana dengan alert (nanti bisa di-upgrade)
    showNotification(`💬 ${post.description || 'Postingan'}\n❤️ ${post.likes_count || 0} likes`);
}

// ============================================================
// INTEGRASI DENGAN FEED - TAMPILKAN USER POSTS DI FEED
// ============================================================

/*
async function loadUserPostsForFeed() {
    try {
        const { data, error } = await supabaseClient
            .from('posts')
            .select('*, profiles(username)')
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Load user posts for feed error:', error);
        return [];
    }
}
*/
// ============================================================
// LOAD USER POSTS FOR FEED - DIPERBAIKI (TANPA JOIN)
// ============================================================
async function loadUserPostsForFeed() {
    try {
        // Ambil semua posts tanpa join ke profiles
        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        
        // Ambil data user secara terpisah untuk setiap post
        const postsWithUser = [];
        for (const post of posts || []) {
            // Ambil profile user berdasarkan user_id
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('username')
                .eq('user_id', post.user_id)
                .maybeSingle();
            
            postsWithUser.push({
                ...post,
                profiles: profile || { username: 'User' }
            });
        }
        
        return postsWithUser;
        
    } catch (error) {
        console.error('Load user posts for feed error:', error);
        return [];
    }
}


// ============================================================
// MODIFIKASI LOAD FEED VIDEOS - TAMBAHKAN USER POSTS
// ============================================================

/*
const originalLoadFeedData = loadFeedVideosData;
loadFeedVideosData = async function(reset = true) {
    // Panggil original
    await originalLoadFeedData(reset);
    
    // Tambahkan user posts ke feed (hanya jika user login dan punya posts)
    if (currentUser) {
        const userPostsData = await loadUserPostsForFeed();
        if (userPostsData.length > 0) {
            const userVideos = userPostsData.map(post => ({
                id: 'user-' + post.id,
                videoUrl: post.media_url,
                thumbnail: post.media_url,
                user: post.profiles?.username || 'User',
                duration: 30,
                likes: post.likes_count || 0,
                shares: 0,
                description: post.description || '',
                hashtags: ['#userpost', '#alovera'],
                isLiked: false,
                isUserPost: true,
                postId: post.id
            }));
            
            // Tambahkan ke feed (di awal atau di akhir)
            feedVideosData = [...feedVideosData, ...userVideos];
            renderFeedVideosData();
        }
    }
};
*/
const originalLoadFeedData = loadFeedVideosData;
loadFeedVideosData = async function(reset = true) {
    await originalLoadFeedData(reset);
    
    if (currentUser) {
        const userPostsData = await loadUserPostsForFeed();
        // ⚠️ HANYA ambil yang video (bukan gambar)
        const videoPosts = userPostsData.filter(post => 
            post.media_type === 'video' || 
            (post.media_url && /\.(mp4|webm|mov|m4v)$/i.test(post.media_url))
        );
        
        if (videoPosts.length > 0) {
            const userVideos = videoPosts.map(post => ({
                id: 'user-' + post.id,
                videoUrl: post.media_url,
                thumbnail: null,                    // ✅ NULL untuk user post
                user: post.profiles?.username || 'User',
                duration: 0,
                likes: post.likes_count || 0,
                shares: 0,
                description: post.description || '',
                hashtags: ['#userpost', '#alovera'],
                isLiked: false,
                isUserPost: true,
                postId: post.id
            }));
            
            // Gabungkan user videos di depan (biar user lihat post sendiri dulu)
            feedVideosData = [...userVideos, ...feedVideosData];
            renderFeedVideosData();
        }
    }
};

// ============================================================
// OVERRIDE NAVIGATE UNTUK PROFIL
// ============================================================
const originalNavProfile = window.navigateTo;
window.navigateTo = function(page) {
    originalNavProfile(page);
    
    if (page === 'profile') {
        setTimeout(() => {
            checkAuthStatus();
            updateProfileUI();
            renderUserPosts();
        }, 300);
    }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Cek auth status
    setTimeout(checkAuthStatus, 500);
});

console.log(' Social Feed & Auth module loaded!');








// ============================================================
// CEK STATUS AUTH - DEBUG
// ============================================================
async function debugAuthStatus() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        console.log(' Session:', session);
        console.log(' User:', session?.user);
        console.log('Error:', error);
        
        if (session?.user) {
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();
            console.log(' Profile:', profile);
            console.log(' Profile Error:', profileError);
        }
    } catch (e) {
        console.error('Debug error:', e);
    }
}

// Panggil di console: debugAuthStatus()











// ============================================================
// POST DETAIL POPUP
// ============================================================
let currentDetailPost = null;

function openPostDetail(postId) {
    const post = userPosts.find(p => p.id === postId);
    if (!post) {
        showNotification('Postingan tidak ditemukan');
        return;
    }
    
    currentDetailPost = post;
    const modal = document.getElementById('postDetailModal');
    const body = document.getElementById('postDetailBody');
    
    // Dapatkan username
    const username = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
    const avatarLetter = (username || 'U')[0].toUpperCase();
    /*
    const mediaHTML = post.media_type === 'video' 
        ? `<video src="${post.media_url}" controls></video>`
        : `<img src="${post.media_url}" alt="Post">`;
        */
const mediaHTML = post.media_type === 'video' 
    ? `<video src="${post.media_url}" 
              controls 
              playsinline 
              webkit-playsinline
              preload="metadata"
              poster=""></video>`
    : `<img src="${post.media_url}" alt="Post">`;
    
        
    
    body.innerHTML = `
        <div class="post-detail-user">
            <div class="post-detail-avatar">${avatarLetter}</div>
            <div class="post-detail-username">${username}</div>
        </div>
        <div class="post-detail-media">${mediaHTML}</div>
        <div class="post-detail-desc">${post.description || 'Tidak ada deskripsi'}</div>
        <div class="post-detail-stats">
            <span><i class="fas fa-heart"></i> ${post.likes_count || 0} Like</span>
            <span><i class="far fa-clock"></i> ${new Date(post.created_at).toLocaleDateString('id-ID')}</span>
        </div>
        <div class="post-detail-actions">
            <button class="btn-delete-post" onclick="deletePost('${post.id}')">
                <i class="fas fa-trash"></i> Hapus Postingan
            </button>
            <button class="btn-like-post ${post.isLiked ? 'liked' : ''}" onclick="toggleLikePost('${post.id}')">
                <i class="fas fa-heart"></i> ${post.isLiked ? 'Batal Like' : 'Like'}
            </button>
        </div>
    `;
    
    /*
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    }
    */
    
        modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ✅ AUTOPLAY video jika ini postingan video
    if (post.media_type === 'video') {
        setTimeout(() => {
            const vid = modal.querySelector('video');
            if (vid) {
                // Set muted dulu (browser butuh muted untuk autoplay)
                vid.muted = true;
                vid.volume = 1.0;
                vid.play()
                    .then(() => {
                        console.log('▶️ Video autoplay started');
                    })
                    .catch(err => {
                        console.warn('⚠️ Autoplay gagal, user perlu klik manual:', err.message);
                    });
            }
        }, 200);
    }
}
    
    


function closePostDetail() {
    document.getElementById('postDetailModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closePostDetailOutside(e) {
    if (e.target === document.getElementById('postDetailModal')) {
        closePostDetail();
    }
}




// ============================================================
// DELETE POST
// ============================================================
async function deletePost(postId) {
    if (!confirm('Yakin ingin menghapus postingan ini?')) return;
    
    try {
        // Hapus dari database
        const { error } = await supabaseClient
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        // Hapus dari storage (opsional)
        const post = userPosts.find(p => p.id === postId);
        if (post && post.media_url) {
            const fileName = post.media_url.split('/').pop();
            const folderPath = `${currentUser.id}/${fileName}`;
            await supabaseClient.storage.from('posts').remove([folderPath]);
        }
        
        showNotification(' Postingan dihapus');
        closePostDetail();
        
        // Refresh data
        await loadUserProfileData();
        updateProfileUI();
        renderUserPosts();
        
        // Refresh feed jika perlu
        if (document.getElementById('feedPage')?.classList.contains('active')) {
            feedVideosData = [];
            loadFeedVideosData(true);
        }
        
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Gagal hapus: ' + error.message);
    }
}

// ============================================================
// LIKE POST
// ============================================================
async function toggleLikePost(postId) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    try {
        const post = userPosts.find(p => p.id === postId);
        if (!post) return;
        
        // Cek apakah sudah like
        const { data: existingLike, error: checkError } = await supabaseClient
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .maybeSingle();
        
        if (checkError && checkError.code !== 'PGRST116') throw checkError;
        
        if (existingLike) {
            // Unlike
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            // Update likes count
            await supabaseClient
                .from('posts')
                .update({ likes_count: post.likes_count - 1 })
                .eq('id', postId);
            
            post.likes_count -= 1;
            post.isLiked = false;
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // Like
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            // Update likes count
            await supabaseClient
                .from('posts')
                .update({ likes_count: post.likes_count + 1 })
                .eq('id', postId);
            
            post.likes_count += 1;
            post.isLiked = true;
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update popup jika terbuka
        if (document.getElementById('postDetailModal').classList.contains('active')) {
            openPostDetail(postId);
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('Gagal: ' + error.message);
    }
}

// ============================================================
// EDIT PROFIL
// ============================================================

/*
function openEditProfileModal() {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const profile = currentUser.profile || {};
    document.getElementById('editUsername').value = profile.username || '';
    document.getElementById('editBio').value = profile.bio || '';
    document.getElementById('editProfileModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeEditProfileOutside(e) {
    if (e.target === document.getElementById('editProfileModal')) {
        closeEditProfileModal();
    }
}

async function saveEditProfile(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        return;
    }
    
    const username = document.getElementById('editUsername').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    
    if (!username) {
        showNotification('Nama pengguna wajib diisi');
        return;
    }
    
    const btn = document.querySelector('#editProfileForm .btn-save-profile');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .update({
                username: username,
                bio: bio || '',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', currentUser.id)
            .select()
            .single();
        
        if (error) throw error;
        
        currentUser.profile = data;
        showNotification('✅ Profil berhasil diperbarui!');
        closeEditProfileModal();
        
        updateProfileUI();
        updateUIForLoggedIn();
        
    } catch (error) {
        console.error('Edit profile error:', error);
        showNotification('❌ Gagal update: ' + error.message);
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
}
*/


// ============================================================
// EDIT PROFIL - DENGAN UPLOAD FOTO
// ============================================================
function openEditProfileModal() {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const profile = currentUser.profile || {};
    document.getElementById('editUsername').value = profile.username || '';
    document.getElementById('editBio').value = profile.bio || '';
    document.getElementById('editBioCount').textContent = (profile.bio || '').length;
    document.getElementById('editProfileModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeEditProfileOutside(e) {
    if (e.target === document.getElementById('editProfileModal')) {
        closeEditProfileModal();
    }
}

async function saveEditProfile(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        return;
    }
    
    const username = document.getElementById('editUsername').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    
    if (!username) {
        showNotification('Nama pengguna wajib diisi');
        return;
    }
    
    const btn = document.querySelector('#editProfileForm .btn-save-profile');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .update({
                username: username,
                bio: bio || '',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', currentUser.id)
            .select()
            .single();
        
        if (error) throw error;
        
        currentUser.profile = data;
        showNotification('Profil berhasil diperbarui!');
        closeEditProfileModal();
        
        updateProfileUI();
        updateUIForLoggedIn();
        
    } catch (error) {
        console.error('Edit profile error:', error);
        showNotification('❌ Gagal update: ' + error.message);
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
}

// ============================================================
// UPLOAD AVATAR
// ============================================================
async function uploadAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        return;
    }
    
    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Ukuran file terlalu besar. Maksimal 2 MB.');
        return;
    }
    
    // Validasi tipe
    if (!file.type.startsWith('image/')) {
        showNotification('Format file tidak didukung. Gunakan JPG atau PNG.');
        return;
    }
    
    const btn = document.querySelector('.btn-edit-profile');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Upload...';
    
    try {
        // Upload ke Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `avatars/${currentUser.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabaseClient
            .storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabaseClient
            .storage
            .from('avatars')
            .getPublicUrl(fileName);
        
        const avatarUrl = urlData.publicUrl;
        
        // Update profile
        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('user_id', currentUser.id);
        
        if (updateError) throw updateError;
        
        currentUser.profile.avatar_url = avatarUrl;
        
        showNotification('✅ Foto profil berhasil diupload!');
        updateProfileUI();
        
    } catch (error) {
        console.error('Upload avatar error:', error);
        showNotification('❌ Gagal upload: ' + error.message);
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-pen"></i> Edit';
    event.target.value = '';
}

// ============================================================
// UPDATE PROFILE UI - DENGAN AVATAR
// ============================================================

/*
function updateProfileUI() {
    if (!currentUser) {
        document.getElementById('profileAvatarText').textContent = 'U';
        document.getElementById('profileNameDisplay').textContent = 'Pengunjung';
        document.getElementById('profileEmailDisplay').textContent = '-';
        document.getElementById('profileBioDisplay').textContent = 'Login untuk membagikan karya Anda';
        document.getElementById('statKarya').textContent = '0';
        document.getElementById('statLikes').textContent = '0';
        document.getElementById('editProfileBtn').style.display = 'none';
        document.getElementById('settingsBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        return;
    }
    
    const profile = currentUser.profile || {};
    const avatarLetter = (profile.username || currentUser.email || 'U')[0].toUpperCase();
    const avatarUrl = profile.avatar_url || null;
    
    const avatarDisplay = document.getElementById('profileAvatarDisplay');
    const avatarText = document.getElementById('profileAvatarText');
    
    if (avatarUrl) {
        // Tampilkan gambar avatar
        avatarDisplay.style.backgroundImage = `url(${avatarUrl})`;
        avatarDisplay.style.backgroundSize = 'cover';
        avatarDisplay.style.backgroundPosition = 'center';
        avatarText.style.display = 'none';
    } else {
        avatarDisplay.style.backgroundImage = 'none';
        avatarDisplay.style.background = 'linear-gradient(135deg, #0f3b1a, #1a6b3c)';
        avatarText.style.display = 'flex';
        avatarText.textContent = avatarLetter;
    }
    
    document.getElementById('profileNameDisplay').textContent = profile.username || currentUser.email.split('@')[0];
    document.getElementById('profileEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileBioDisplay').textContent = profile.bio || 'Belum ada bio';
    document.getElementById('editProfileBtn').style.display = 'inline-flex';
    document.getElementById('settingsBtn').style.display = 'inline-flex';
    document.getElementById('logoutBtn').style.display = 'inline-flex';
    
    // Stats
    let totalLikes = 0;
    userPosts.forEach(post => { totalLikes += post.likes_count || 0; });
    document.getElementById('statKarya').textContent = userPosts.length;
    document.getElementById('statLikes').textContent = totalLikes;
}
*/





// ============================================================
// UPDATE PROFIL UI - DIPERBAIKI
// ============================================================

/*
function updateProfileUI() {
    if (!currentUser) {
        document.getElementById('profileAvatarDisplay').textContent = 'U';
        document.getElementById('profileNameDisplay').textContent = 'Pengunjung';
        document.getElementById('profileEmailDisplay').textContent = '-';
        document.getElementById('profileBioDisplay').textContent = 'Login untuk membagikan karya Anda';
        document.getElementById('statKarya').textContent = '0';
        document.getElementById('statLikes').textContent = '0';
        document.getElementById('editProfileBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        return;
    }
    
    const profile = currentUser.profile || {};
    const avatarLetter = (profile.username || currentUser.email || 'U')[0].toUpperCase();
    
    document.getElementById('profileAvatarDisplay').textContent = avatarLetter;
    document.getElementById('profileNameDisplay').textContent = profile.username || currentUser.email.split('@')[0];
    document.getElementById('profileEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileBioDisplay').textContent = profile.bio || 'Belum ada bio';
    document.getElementById('editProfileBtn').style.display = 'inline-flex';
    document.getElementById('logoutBtn').style.display = 'inline-flex';
    
    // Stats
    let totalLikes = 0;
    userPosts.forEach(post => { totalLikes += post.likes_count || 0; });
    document.getElementById('statKarya').textContent = userPosts.length;
    document.getElementById('statLikes').textContent = totalLikes;
}
*/
// ============================================================
// UPDATE PROFILE UI - DENGAN AVATAR & 3 TOMBOL
// ============================================================
/*
function updateProfileUI() {
    if (!currentUser) {
        // Guest / Belum Login
        const avatarDisplay = document.getElementById('profileAvatarDisplay');
        const avatarText = document.getElementById('profileAvatarText');
        if (avatarDisplay) {
            avatarDisplay.style.backgroundImage = 'none';
            avatarDisplay.style.background = 'linear-gradient(135deg, #0f3b1a, #1a6b3c)';
        }
        if (avatarText) {
            avatarText.style.display = 'flex';
            avatarText.textContent = 'U';
        }
        
        document.getElementById('profileNameDisplay').textContent = 'Pengunjung';
        document.getElementById('profileEmailDisplay').textContent = '-';
        document.getElementById('profileBioDisplay').textContent = 'Login untuk membagikan karya Anda';
        document.getElementById('statKarya').textContent = '0';
        document.getElementById('statLikes').textContent = '0';
        
        // SEMBUNYIKAN semua tombol saat guest
        document.getElementById('editProfileBtn').style.display = 'none';
        document.getElementById('settingsBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        return;
    }
    
    // User Login - TAMPILKAN SEMUA TOMBOL
    const profile = currentUser.profile || {};
    const avatarLetter = (profile.username || currentUser.email || 'U')[0].toUpperCase();
    const avatarUrl = profile.avatar_url || null;
    
    const avatarDisplay = document.getElementById('profileAvatarDisplay');
    const avatarText = document.getElementById('profileAvatarText');
    
    if (avatarDisplay) {
        if (avatarUrl) {
            avatarDisplay.style.backgroundImage = `url(${avatarUrl})`;
            avatarDisplay.style.backgroundSize = 'cover';
            avatarDisplay.style.backgroundPosition = 'center';
        } else {
            avatarDisplay.style.backgroundImage = 'none';
            avatarDisplay.style.background = 'linear-gradient(135deg, #0f3b1a, #1a6b3c)';
        }
    }
    if (avatarText) {
        avatarText.style.display = avatarUrl ? 'none' : 'flex';
        avatarText.textContent = avatarLetter;
    }
    
    document.getElementById('profileNameDisplay').textContent = profile.username || currentUser.email.split('@')[0];
    document.getElementById('profileEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileBioDisplay').textContent = profile.bio || 'Belum ada bio';
    
    // TAMPILKAN SEMUA 3 TOMBOL
    document.getElementById('editProfileBtn').style.display = 'inline-flex';
    document.getElementById('settingsBtn').style.display = 'inline-flex';
    document.getElementById('logoutBtn').style.display = 'inline-flex';
    
    // Stats
    let totalLikes = 0;
    userPosts.forEach(post => { totalLikes += post.likes_count || 0; });
    document.getElementById('statKarya').textContent = userPosts.length;
    document.getElementById('statLikes').textContent = totalLikes;
}
*/


// ============================================================
// UPDATE UI FOR LOGGED IN - DIPERBAIKI
// ============================================================
function updateUIForLoggedIn() {
    const profile = currentUser.profile || {};
    const joinPrompt = document.getElementById('joinPrompt');
    
    if (joinPrompt) {
        joinPrompt.querySelector('h4').textContent = `👋 Selamat datang, ${profile.username || currentUser.email.split('@')[0]}`;
        joinPrompt.querySelector('p').textContent = 'Anda sudah login. Bagikan karya Anda sekarang!';
        joinPrompt.querySelector('.btn-join-small').style.display = 'none';
    }
    
    updateProfileUI();
    renderUserPosts();
}

function updateUIForLoggedOut() {
    const joinPrompt = document.getElementById('joinPrompt');
    if (joinPrompt) {
        joinPrompt.querySelector('h4').textContent = '✨ Login untuk Berbagi Karya';
        joinPrompt.querySelector('p').textContent = 'Masuk untuk mengupload foto/video dan berinteraksi dengan komunitas.';
        joinPrompt.querySelector('.btn-join-small').style.display = 'inline-flex';
        joinPrompt.querySelector('.btn-join-small').textContent = 'Login Sekarang';
        joinPrompt.querySelector('.btn-join-small').onclick = openAuthModal;
    }
    updateProfileUI();
}

// ============================================================
// RENDER USER POSTS - DENGAN CLICK UNTUK DETAIL
// ============================================================
function renderUserPosts() {
    const grid = document.getElementById('profilePostsGrid');
    if (!grid) return;
    
    if (!currentUser || userPosts.length === 0) {
        grid.innerHTML = `
            <div class="profile-posts-empty">
                <i class="fas fa-image"></i>
                <span>Belum ada postingan</span>
                <span style="font-size:12px;color:var(--text-muted);">Klik tombol + untuk upload</span>
            </div>
        `;
        return;
    }
    
    /*
    grid.innerHTML = userPosts.map(post => `
        <div class="profile-post-item" onclick="openPostDetail('${post.id}')">
            ${post.media_type === 'video' 
                ? `<video src="${post.media_url}" muted></video>` 
                : `<img src="${post.media_url}" alt="Post" loading="lazy">`
            }
            <div class="post-overlay">
                <span><i class="fas fa-heart"></i> ${post.likes_count || 0}</span>
            </div>
        </div>
    `).join('');
}
*/
    grid.innerHTML = userPosts.map(post => `
        <div class="profile-post-item" onclick="openPostDetail('${post.id}')">
            ${post.media_type === 'video' 
                ? `<video src="${post.media_url}" 
                          muted 
                          preload="metadata"
                          playsinline
                          webkit-playsinline
                          crossorigin="anonymous"
                          onloadeddata="this.currentTime = 0.5"
                          onerror="handleVideoThumbError(this)"></video>
                   <div class="video-thumb-indicator"><i class="fas fa-play"></i></div>` 
                : `<img src="${post.media_url}" alt="Post" loading="lazy">`
            }
            <div class="post-overlay">
                <span><i class="fas fa-heart"></i> ${post.likes_count || 0}</span>
            </div>
        </div>
    `).join('');
}

// Helper: handle error video thumbnail
function handleVideoThumbError(videoEl) {
    // Fallback: tampilkan placeholder jika video gagal load
    videoEl.style.display = 'none';
    const parent = videoEl.parentElement;
    if (parent && !parent.querySelector('.video-fallback')) {
        const fallback = document.createElement('div');
        fallback.className = 'video-fallback';
        fallback.innerHTML = '<i class="fas fa-video"></i>';
        parent.insertBefore(fallback, parent.firstChild);
    }
}



// ============================================================
// INTEGRASI DENGAN STOCK - TAMPILKAN USER POSTS DI PENCARIAN
// ============================================================
// Modifikasi fungsi fetchStockItems untuk menyertakan user posts

const originalFetchStock = fetchStockItems;
fetchStockItems = async function() {
    // Panggil original
    await originalFetchStock();
    
    // Tambahkan user posts ke stock jika user login
    if (currentUser && userPosts.length > 0) {
        const userStockItems = userPosts.map(post => ({
            ...post,
            src: { 
                medium: post.media_url,
                large2x: post.media_url,
                original: post.media_url
            },
            photographer: currentUser.profile?.username || currentUser.email.split('@')[0],
            alt: post.description || 'User post',
            type: 'photo',
            isUserPost: true,
            postId: post.id
        }));
        
        // Gabungkan dengan stock items
        stockItems = [...userStockItems, ...stockItems];
        renderStockItems(stockItems);
    }
};






// ============================================================
// JUGA MODIFIKASI UNTUK SEARCH STOCK
// ============================================================
const originalSearchStock = searchStock;
searchStock = async function() {
    const query = document.getElementById('stockSearchInput').value.trim().toLowerCase();
    
    if (!query) {
        // Jika kosong, tampilkan semua termasuk user posts
        await originalFetchStock();
        return;
    }
    
    // Filter user posts berdasarkan query
    const userMatches = userPosts.filter(post => 
        post.description?.toLowerCase().includes(query) ||
        currentUser?.profile?.username?.toLowerCase().includes(query)
    );
    
    const userStockItems = userMatches.map(post => ({
        ...post,
        src: { 
            medium: post.media_url,
            large2x: post.media_url,
            original: post.media_url
        },
        photographer: currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User',
        alt: post.description || 'User post',
        type: 'photo',
        isUserPost: true,
        postId: post.id
    }));
    
    // Panggil original search
    const originalQuery = stockCurrentQuery;
    stockCurrentQuery = query;
    await originalFetchStock();
    
    // Tambahkan user matches
    stockItems = [...userStockItems, ...stockItems];
    renderStockItems(stockItems);
};

console.log(' Social Feed & Auth module loaded!');
console.log(' User posts akan muncul di: Feed, Stock Gallery, dan Pencarian Stock');










/*

// ============================================================
// SHOW STOCK DETAIL - DENGAN LIKE
// ============================================================
function showStockDetail(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    // Cek apakah ini user post atau pexels
    const isUserPost = photo.isUserPost || false;
    const postId = photo.postId || null;
    const isLiked = photo.isLiked || false;
    const likeCount = photo.likes_count || 0;
    
    // Untuk user post, ambil data dari supabase
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    // Jika user post, cek like terbaru
    if (isUserPost && postId) {
        // Cari di userPosts untuk mendapatkan data terbaru
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${isUserPost ? (currentUser?.profile?.username || 'User') : (photo.photographer || 'Unknown')}</div>
                ${isUserPost ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${photo.src.original}', '${photo.photographer || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">${displayLikes}</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
}

// ============================================================
// SHOW VIDEO DETAIL - DENGAN LIKE
// ============================================================
function showVideoDetail(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    const videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
    const thumb = video.image || video.video_pictures?.[0]?.picture || '';
    
    // Cek apakah ini user post atau pexels
    const isUserPost = video.isUserPost || false;
    const postId = video.postId || null;
    const isLiked = video.isLiked || false;
    const likeCount = video.likes_count || 0;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${isUserPost ? (currentUser?.profile?.username || 'User') : (video.user?.name || 'Unknown')}</div>
                ${isUserPost ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${video.user?.name || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">${displayLikes}</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
}

// ============================================================
// TOGGLE LIKE UNTUK STOCK (USER POST)
// ============================================================
async function toggleLikeStock(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification('💡 Like hanya untuk postingan komunitas');
        return;
    }
    
    // Cari post di userPosts
    const postIndex = userPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        showNotification('Postingan tidak ditemukan');
        return;
    }
    
    const post = userPosts[postIndex];
    const isCurrentlyLiked = post.isLiked || false;
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        if (isCurrentlyLiked) {
            // UNLIKE
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            // Update likes count
            const newCount = (post.likes_count || 1) - 1;
            const { error: updateError } = await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            if (updateError) throw updateError;
            
            // Update local data
            post.likes_count = newCount;
            post.isLiked = false;
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            // Update likes count
            const newCount = (post.likes_count || 0) + 1;
            const { error: updateError } = await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            if (updateError) throw updateError;
            
            // Update local data
            post.likes_count = newCount;
            post.isLiked = true;
            
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update button di popup
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = post.likes_count || 0;
            }
            btnElement.classList.toggle('liked', post.isLiked);
            btnElement.classList.remove('loading');
            
            // Update juga di detail popup jika terbuka
            const allLikeBtns = document.querySelectorAll('.btn-like-stock');
            allLikeBtns.forEach(btn => {
                if (btn !== btnElement) {
                    const count = btn.querySelector('.like-count');
                    if (count) count.textContent = post.likes_count || 0;
                    btn.classList.toggle('liked', post.isLiked);
                }
            });
        }
        
        // Refresh stock items jika perlu
        if (document.getElementById('stockPage')?.classList.contains('active')) {
            // Update stockItems yang sesuai
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = post.likes_count;
                stockItems[stockIndex].isLiked = post.isLiked;
            }
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('❌ Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
}
*/




// ============================================================
// MODIFIKASI RENDER STOCK ITEMS - TAMBAHKAN USER POST DATA
// ============================================================
/*
const originalRenderStockItems = renderStockItems;
renderStockItems = function(items, append = false) {
    // Panggil original
    originalRenderStockItems(items, append);
    
    // Update user post data di stockItems
    if (currentUser && userPosts.length > 0) {
        // Sinkronisasi data like dari userPosts ke stockItems
        userPosts.forEach(userPost => {
            const stockIndex = stockItems.findIndex(item => item.postId === userPost.id && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = userPost.likes_count || 0;
                stockItems[stockIndex].isLiked = userPost.isLiked || false;
            }
        });
    }
};
*/




// ============================================================
// LOAD USER PROFILE DATA - DENGAN STATUS LIKE
// ============================================================
async function loadUserProfileData() {
    if (!currentUser) return;
    
    try {
        // Load profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
        
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile load error:', profileError);
        }
        
        if (profile) {
            currentUser.profile = profile;
        } else {
            const { data: newProfile, error: createError } = await supabaseClient
                .from('profiles')
                .insert([{
                    user_id: currentUser.id,
                    username: currentUser.email.split('@')[0] || 'user',
                    email: currentUser.email,
                    bio: ''
                }])
                .select()
                .maybeSingle();
            
            if (!createError && newProfile) {
                currentUser.profile = newProfile;
            }
        }
        
        // Load user posts dengan status like
        const { data: posts, error: postsError } = await supabaseClient
            .from('posts')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (!postsError) {
            userPosts = posts || [];
            
            // Cek status like untuk setiap post
            if (currentUser && userPosts.length > 0) {
                for (const post of userPosts) {
                    const { data: likeData, error: likeError } = await supabaseClient
                        .from('likes')
                        .select('*')
                        .eq('post_id', post.id)
                        .eq('user_id', currentUser.id)
                        .maybeSingle();
                    
                    if (!likeError) {
                        post.isLiked = !!likeData;
                    }
                }
            }
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update stock items jika ada
        if (stockItems.length > 0) {
            syncUserPostsToStock();
        }
        
    } catch (error) {
        console.error('Load profile data error:', error);
    }
}

// ============================================================
// SYNC USER POSTS KE STOCK ITEMS
// ============================================================
function syncUserPostsToStock() {
    if (!currentUser || userPosts.length === 0) return;
    
    userPosts.forEach(userPost => {
        const stockIndex = stockItems.findIndex(item => item.postId === userPost.id && item.isUserPost);
        if (stockIndex !== -1) {
            stockItems[stockIndex].likes_count = userPost.likes_count || 0;
            stockItems[stockIndex].isLiked = userPost.isLiked || false;
        }
    });
}




// ============================================================
// FETCH STOCK ITEMS - DENGAN USER POSTS
// ============================================================

/*
const originalFetchStock = fetchStockItems;
fetchStockItems = async function() {
    await originalFetchStock();
    
    // Tambahkan user posts ke stock jika user login
    if (currentUser && userPosts.length > 0) {
        // Sinkronisasi data like
        syncUserPostsToStock();
        
        const userStockItems = userPosts.map(post => ({
            ...post,
            src: { 
                medium: post.media_url,
                large2x: post.media_url,
                original: post.media_url
            },
            photographer: currentUser.profile?.username || currentUser.email.split('@')[0],
            alt: post.description || 'User post',
            type: 'photo',
            isUserPost: true,
            postId: post.id,
            likes_count: post.likes_count || 0,
            isLiked: post.isLiked || false
        }));
        
        // Gabungkan dengan stock items (hindari duplikasi)
        const existingIds = new Set(stockItems.map(item => item.postId).filter(id => id));
        const newItems = userStockItems.filter(item => !existingIds.has(item.postId));
        stockItems = [...newItems, ...stockItems];
        renderStockItems(stockItems);
    }
};
*/




// ============================================================
// RENDER USER POSTS - DENGAN SYNC KE STOCK
// ============================================================
const originalRenderUserPosts = renderUserPosts;
renderUserPosts = function() {
    originalRenderUserPosts();
    
    // Sinkronisasi ke stock
    if (stockItems.length > 0) {
        syncUserPostsToStock();
        // Render ulang stock jika halaman stock aktif
        if (document.getElementById('stockPage')?.classList.contains('active')) {
            renderStockItems(stockItems, true);
        }
    }
};






// ============================================================
// SHOW STOCK DETAIL - DENGAN LIKE (VERSI FINAL)
// ============================================================
/*
function showStockDetail(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    // Cek apakah ini user post atau pexels
    const isUserPost = photo.isUserPost || false;
    const postId = photo.postId || null;
    const likeCount = photo.likes_count || 0;
    const isLiked = photo.isLiked || false;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    // Jika user post, cari data terbaru dari userPosts
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    // Nama photographer
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
        isCommunity = true;
    } else if (photo.photographer) {
        photographerName = photo.photographer;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${photo.src.original}', '${photographerName || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
}
*/
// ============================================================
// SHOW VIDEO DETAIL - DENGAN LIKE (VERSI FINAL)
// ============================================================

/*
function showVideoDetail(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    const videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
    const thumb = video.image || video.video_pictures?.[0]?.picture || '';
    
    // Cek apakah ini user post atau pexels
    const isUserPost = video.isUserPost || false;
    const postId = video.postId || null;
    const likeCount = video.likes_count || 0;
    const isLiked = video.isLiked || false;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
        isCommunity = true;
    } else if (video.user?.name) {
        photographerName = video.user.name;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${photographerName || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
}
*/
// ============================================================
// TOGGLE LIKE UNTUK STOCK (USER POST)
// ============================================================

/*
async function toggleLikeStock(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification('💡 Like hanya untuk postingan komunitas');
        return;
    }
    
    // Cari post di userPosts
    const postIndex = userPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        showNotification('Postingan tidak ditemukan');
        return;
    }
    
    const post = userPosts[postIndex];
    const isCurrentlyLiked = post.isLiked || false;
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        if (isCurrentlyLiked) {
            // UNLIKE
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            // Update likes count
            const newCount = Math.max(0, (post.likes_count || 1) - 1);
            const { error: updateError } = await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            if (updateError) throw updateError;
            
            // Update local data
            post.likes_count = newCount;
            post.isLiked = false;
            
            // Update stockItems
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = false;
            }
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            // Update likes count
            const newCount = (post.likes_count || 0) + 1;
            const { error: updateError } = await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            if (updateError) throw updateError;
            
            // Update local data
            post.likes_count = newCount;
            post.isLiked = true;
            
            // Update stockItems
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = true;
            }
            
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update button di popup
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = post.likes_count || 0;
            }
            btnElement.classList.toggle('liked', post.isLiked);
            btnElement.classList.remove('loading');
            
            // Update juga di semua tombol like yang lain
            document.querySelectorAll('.btn-like-stock').forEach(btn => {
                if (btn !== btnElement) {
                    const count = btn.querySelector('.like-count');
                    if (count) count.textContent = post.likes_count || 0;
                    btn.classList.toggle('liked', post.isLiked);
                }
            });
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('❌ Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
}
*/


/*✅✅✅✅✅

// ============================================================
// SHOW STOCK DETAIL - DENGAN LIKE (TERINTEGRASI)
// ============================================================
window.showStockDetail = function(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    // Cek apakah ini user post atau pexels
    const isUserPost = photo.isUserPost || false;
    const postId = photo.postId || null;
    const likeCount = photo.likes_count || 0;
    const isLiked = photo.isLiked || false;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    // Jika user post, cari data terbaru dari userPosts
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    // Nama photographer
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
        isCommunity = true;
    } else if (photo.photographer) {
        photographerName = photo.photographer;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${photo.src.original}', '${photographerName || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
};

// ============================================================
// SHOW VIDEO DETAIL - DENGAN LIKE (TERINTEGRASI)
// ============================================================
window.showVideoDetail = function(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    const videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
    const thumb = video.image || video.video_pictures?.[0]?.picture || '';
    
    // Cek apakah ini user post atau pexels
    const isUserPost = video.isUserPost || false;
    const postId = video.postId || null;
    const likeCount = video.likes_count || 0;
    const isLiked = video.isLiked || false;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
        isCommunity = true;
    } else if (video.user?.name) {
        photographerName = video.user.name;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${photographerName || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
};

// ============================================================
// TOGGLE LIKE UNTUK STOCK (USER POST) - TERINTEGRASI
// ============================================================
window.toggleLikeStock = async function(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification('💡 Like hanya untuk postingan komunitas');
        return;
    }
    
    // Cari post di userPosts
    const postIndex = userPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        showNotification('Postingan tidak ditemukan');
        return;
    }
    
    const post = userPosts[postIndex];
    const isCurrentlyLiked = post.isLiked || false;
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        if (isCurrentlyLiked) {
            // UNLIKE
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            const newCount = Math.max(0, (post.likes_count || 1) - 1);
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            post.likes_count = newCount;
            post.isLiked = false;
            
            // Update stockItems
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = false;
            }
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            const newCount = (post.likes_count || 0) + 1;
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            post.likes_count = newCount;
            post.isLiked = true;
            
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = true;
            }
            
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update button di popup
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = post.likes_count || 0;
            }
            btnElement.classList.toggle('liked', post.isLiked);
            btnElement.classList.remove('loading');
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('❌ Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
};

// ============================================================
// FETCH STOCK ITEMS - DENGAN USER POSTS (TANPA OVERRIDE DUPLIKAT)
// ============================================================
// Gunakan flag untuk menghindari duplikasi
if (typeof window._stockFetchOverridden === 'undefined') {
    window._stockFetchOverridden = true;
    
    const originalFetchStockFn = fetchStockItems;
    fetchStockItems = async function() {
        await originalFetchStockFn();
        
        if (currentUser && userPosts.length > 0) {
            const userStockItems = userPosts.map(post => ({
                ...post,
                src: { 
                    medium: post.media_url,
                    large2x: post.media_url,
                    original: post.media_url
                },
                photographer: currentUser.profile?.username || currentUser.email.split('@')[0],
                alt: post.description || 'User post',
                type: 'photo',
                isUserPost: true,
                postId: post.id,
                likes_count: post.likes_count || 0,
                isLiked: post.isLiked || false
            }));
            
            const existingIds = new Set(stockItems.map(item => item.postId).filter(id => id));
            const newItems = userStockItems.filter(item => !existingIds.has(item.postId));
            stockItems = [...newItems, ...stockItems];
            renderStockItems(stockItems);
        }
    };
}
*/





// ============================================================
// SHOW STOCK DETAIL - DENGAN LIKE (TERINTEGRASI)
// ============================================================

/*
window.showStockDetail = function(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    // Cek apakah ini user post atau pexels
    const isUserPost = photo.isUserPost || false;
    const postId = photo.postId || null;
    const likeCount = photo.likes_count || 0;
    const isLiked = photo.isLiked || false;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    // Jika user post, cari data terbaru dari userPosts
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    // Nama photographer
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
        isCommunity = true;
    } else if (photo.photographer) {
        photographerName = photo.photographer;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${photo.src.original}', '${photographerName || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification(' Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
};
*/
// ============================================================
// SHOW STOCK DETAIL - DIPERBAIKI
// ============================================================


/*
window.showStockDetail = function(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    const isUserPost = photo.isUserPost || false;
    const postId = photo.postId || null;
    let displayLikes = photo.likes_count || 0;
    let displayIsLiked = photo.isLiked || false;
    
    // Cari data terbaru dari allUserPosts (BUKAN userPosts)
    if (isUserPost && postId) {
        // Prioritas: cari di allUserPosts (semua user)
        const allPost = allUserPosts.find(p => p.postId === postId || p.id === postId);
        if (allPost) {
            displayLikes = allPost.likes_count || 0;
            displayIsLiked = allPost.isLiked || false;
        } else {
            // Fallback: cari di userPosts (milik sendiri)
            const myPost = userPosts.find(p => p.id === postId);
            if (myPost) {
                displayLikes = myPost.likes_count || 0;
                displayIsLiked = myPost.isLiked || false;
            }
        }
    }
    
    // NAMA PHOTOGRAPHER - GUNAKAN DARI ITEM, BUKAN currentUser
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        // Gunakan nama dari item.photographer (nama asli pemilik postingan)
        photographerName = photo.photographer || 'User';
        isCommunity = true;
    } else if (photo.photographer) {
        photographerName = photo.photographer;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${photo.src.original}', '${photographerName || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
};

*/
// ============================================================
// SHOW STOCK DETAIL - DIPERBAIKI
// ============================================================
window.showStockDetail = function(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    /*
    const isUserPost = photo.isUserPost || false;
    // GUNAKAN item.id (bukan item.postId)
    const postId = photo.id || null;
    */
    const isUserPost = photo.isUserPost || false;
// Prioritas: postId, fallback ke id
const postId = photo.postId || photo.id || null;

    
    let displayLikes = photo.likes_count || 0;
    let displayIsLiked = photo.isLiked || false;
    
    // Cari data terbaru
    if (isUserPost && postId) {
        const allPost = allUserPosts.find(p => p.id === postId);
        if (allPost) {
            displayLikes = allPost.likes_count || 0;
            displayIsLiked = allPost.isLiked || false;
        }
    }
    
    // Nama photographer - gunakan nama asli pemilik postingan
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = photo.photographer || 'User';
        isCommunity = true;
    } else if (photo.photographer) {
        photographerName = photo.photographer;
    }
    
    const mediaUrl = isUserPost ? (photo.media_url || photo.src.original) : photo.src.original;
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">Postingan Komunitas</div>` : ''}
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${mediaUrl}', '${photographerName || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification(' Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
};


// ============================================================
// SHOW VIDEO DETAIL - DENGAN LIKE (TERINTEGRASI)
// ============================================================

/*
window.showVideoDetail = function(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    const videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
    const thumb = video.image || video.video_pictures?.[0]?.picture || '';
    
    // Cek apakah ini user post atau pexels
    const isUserPost = video.isUserPost || false;
    const postId = video.postId || null;
    const likeCount = video.likes_count || 0;
    const isLiked = video.isLiked || false;
    
    let displayLikes = likeCount;
    let displayIsLiked = isLiked;
    
    if (isUserPost && postId) {
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
            displayLikes = userPost.likes_count || 0;
            displayIsLiked = userPost.isLiked || false;
        }
    }
    
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = currentUser?.profile?.username || currentUser?.email?.split('@')[0] || 'User';
        isCommunity = true;
    } else if (video.user?.name) {
        photographerName = video.user.name;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;"> Postingan Komunitas</div>` : ''}
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${photographerName || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification(' Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
};
*/
// ============================================================
// SHOW VIDEO DETAIL - DIPERBAIKI
// ============================================================

/*
window.showVideoDetail = function(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    const videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
    const thumb = video.image || video.video_pictures?.[0]?.picture || '';
    
    const isUserPost = video.isUserPost || false;
    const postId = video.postId || null;
    let displayLikes = video.likes_count || 0;
    let displayIsLiked = video.isLiked || false;
    
    if (isUserPost && postId) {
        const allPost = allUserPosts.find(p => p.postId === postId || p.id === postId);
        if (allPost) {
            displayLikes = allPost.likes_count || 0;
            displayIsLiked = allPost.isLiked || false;
        } else {
            const myPost = userPosts.find(p => p.id === postId);
            if (myPost) {
                displayLikes = myPost.likes_count || 0;
                displayIsLiked = myPost.isLiked || false;
            }
        }
    }
    
    // Nama photographer
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = video.photographer || 'User';
        isCommunity = true;
    } else if (video.user?.name) {
        photographerName = video.user.name;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">📱 Postingan Komunitas</div>` : ''}
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${photographerName || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification('💡 Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
};
*/
// ============================================================
// SHOW VIDEO DETAIL - DIPERBAIKI
// ============================================================
window.showVideoDetail = function(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    if (!modal || !body) return;
    
    /*
    const isUserPost = video.isUserPost || false;
    // GUNAKAN video.id
    const postId = video.id || null;
    */
    const isUserPost = video.isUserPost || false;
// Prioritas: postId, fallback ke id
const postId = video.postId || video.id || null;

    
    
    let displayLikes = video.likes_count || 0;
    let displayIsLiked = video.isLiked || false;
    
    if (isUserPost && postId) {
        const allPost = allUserPosts.find(p => p.id === postId);
        if (allPost) {
            displayLikes = allPost.likes_count || 0;
            displayIsLiked = allPost.isLiked || false;
        }
    }
    
    // Untuk user post (video)
    let videoFile, thumb;
    if (isUserPost) {
        videoFile = { link: video.media_url || video.src.original };
        thumb = video.media_url || video.src.medium;
    } else {
        videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
        thumb = video.image || video.video_pictures?.[0]?.picture || '';
    }
    
    let photographerName = 'Unknown';
    let isCommunity = false;
    
    if (isUserPost) {
        photographerName = video.photographer || 'User';
        isCommunity = true;
    } else if (video.user?.name) {
        photographerName = video.user.name;
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${photographerName}</div>
                ${isCommunity ? `<div class="book-author-large" style="font-size:12px;color:#4ade80;">Postingan Komunitas</div>` : ''}
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${photographerName || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                ${isUserPost && postId ? 
                    `<button class="btn-like-stock ${displayIsLiked ? 'liked' : ''}" onclick="toggleLikeStock('${postId}', this, true)">
                        <i class="fas fa-heart"></i> 
                        <span class="like-count">${displayLikes}</span>
                    </button>` :
                    `<button class="btn-like-stock" onclick="showNotification(' Like hanya untuk postingan komunitas')">
                        <i class="fas fa-heart"></i> <span class="like-count">0</span>
                    </button>`
                }
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
};




// ============================================================
// TOGGLE LIKE UNTUK STOCK (USER POST) - TERINTEGRASI
// ============================================================

/*
window.toggleLikeStock = async function(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification(' Like hanya untuk postingan komunitas');
        return;
    }
    
    // Cari post di userPosts
    const postIndex = userPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        showNotification('Postingan tidak ditemukan');
        return;
    }
    
    const post = userPosts[postIndex];
    const isCurrentlyLiked = post.isLiked || false;
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        if (isCurrentlyLiked) {
            // UNLIKE
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            const newCount = Math.max(0, (post.likes_count || 1) - 1);
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            post.likes_count = newCount;
            post.isLiked = false;
            
            // Update stockItems
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = false;
            }
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            const newCount = (post.likes_count || 0) + 1;
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            post.likes_count = newCount;
            post.isLiked = true;
            
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = true;
            }
            
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update button di popup
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = post.likes_count || 0;
            }
            btnElement.classList.toggle('liked', post.isLiked);
            btnElement.classList.remove('loading');
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('❌ Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
};

*/
// ============================================================
// TOGGLE LIKE UNTUK STOCK - DIPERBAIKI (SEMUA USER)
// ============================================================

/*
window.toggleLikeStock = async function(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification('💡 Like hanya untuk postingan komunitas');
        return;
    }
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        // Cari post di userPosts (milik sendiri) ATAU allUserPosts (semua user)
        let post = userPosts.find(p => p.id === postId);
        let isMyPost = true;
        
        if (!post) {
            post = allUserPosts.find(p => p.postId === postId || p.id === postId);
            isMyPost = false;
        }
        
        if (!post) {
            showNotification('Postingan tidak ditemukan');
            if (btnElement) btnElement.classList.remove('loading');
            return;
        }
        
        // Cek apakah sudah like
        const { data: existingLike, error: checkError } = await supabaseClient
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .maybeSingle();
        
        if (checkError && checkError.code !== 'PGRST116') throw checkError;
        
        if (existingLike) {
            // UNLIKE
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            const currentCount = post.likes_count || 1;
            const newCount = Math.max(0, currentCount - 1);
            
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            // Update local data
            if (isMyPost) {
                const myPost = userPosts.find(p => p.id === postId);
                if (myPost) {
                    myPost.likes_count = newCount;
                    myPost.isLiked = false;
                }
            }
            
            // Update di allUserPosts
            const allPost = allUserPosts.find(p => p.postId === postId || p.id === postId);
            if (allPost) {
                allPost.likes_count = newCount;
                allPost.isLiked = false;
            }
            
            // Update di stockItems
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = false;
            }
            
            // Update post variable
            post.likes_count = newCount;
            post.isLiked = false;
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            const currentCount = post.likes_count || 0;
            const newCount = currentCount + 1;
            
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            // Update local data
            if (isMyPost) {
                const myPost = userPosts.find(p => p.id === postId);
                if (myPost) {
                    myPost.likes_count = newCount;
                    myPost.isLiked = true;
                }
            }
            
            const allPost = allUserPosts.find(p => p.postId === postId || p.id === postId);
            if (allPost) {
                allPost.likes_count = newCount;
                allPost.isLiked = true;
            }
            
            const stockIndex = stockItems.findIndex(item => item.postId === postId && item.isUserPost);
            if (stockIndex !== -1) {
                stockItems[stockIndex].likes_count = newCount;
                stockItems[stockIndex].isLiked = true;
            }
            
            post.likes_count = newCount;
            post.isLiked = true;
            
            // KIRIM NOTIFIKASI KE PEMILIK POST (jika bukan milik sendiri)
            if (!isMyPost && post.user_id && post.user_id !== currentUser.id) {
                const senderName = currentUser.profile?.username || currentUser.email.split('@')[0];
                const message = `❤️ ${senderName} menyukai postingan Anda`;
                
                await createNotification(
                    post.user_id,
                    currentUser.id,
                    'like',
                    postId,
                    message,
                    '#'
                );
            }
            
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update button
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = post.likes_count || 0;
            }
            btnElement.classList.toggle('liked', post.isLiked);
            btnElement.classList.remove('loading');
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('❌ Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
};
*/
// ============================================================
// TOGGLE LIKE UNTUK STOCK - VERSI FINAL (QUERY LANGSUNG)
// ============================================================

/*
window.toggleLikeStock = async function(postId, btnElement, isUserPost = true) {
    console.log('🔍 Toggle like for postId:', postId);
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification('💡 Like hanya untuk postingan komunitas');
        return;
    }
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        // ============================================================
        // STEP 1: AMBIL DATA POST LANGSUNG DARI SUPABASE
        // ============================================================
        const { data: postData, error: postError } = await supabaseClient
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();
        
        if (postError) {
            console.error('Error fetch post:', postError);
            showNotification('❌ Postingan tidak ditemukan');
            if (btnElement) btnElement.classList.remove('loading');
            return;
        }
        
        if (!postData) {
            showNotification('❌ Postingan tidak ditemukan');
            if (btnElement) btnElement.classList.remove('loading');
            return;
        }
        
        console.log('✅ Post found:', postData);
        
        // ============================================================
        // STEP 2: CEK APAKAH SUDAH LIKE
        // ============================================================
        const { data: existingLike, error: checkError } = await supabaseClient
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .maybeSingle();
        
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Check like error:', checkError);
        }
        
        const isCurrentlyLiked = !!existingLike;
        const currentCount = postData.likes_count || 0;
        
        console.log('📊 Current count:', currentCount, '| Liked:', isCurrentlyLiked);
        
        // ============================================================
        // STEP 3: PROSES LIKE / UNLIKE
        // ============================================================
        let newCount;
        
        if (isCurrentlyLiked) {
            // === UNLIKE ===
            const { error: deleteError } = await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            if (deleteError) throw deleteError;
            
            newCount = Math.max(0, currentCount - 1);
            
            const { error: updateError } = await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            if (updateError) throw updateError;
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // === LIKE ===
            const { error: insertError } = await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            if (insertError) throw insertError;
            
            newCount = currentCount + 1;
            
            const { error: updateError } = await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            if (updateError) throw updateError;
            
            // Kirim notifikasi ke pemilik post (jika bukan milik sendiri)
            if (postData.user_id && postData.user_id !== currentUser.id) {
                const senderName = currentUser.profile?.username || currentUser.email.split('@')[0];
                const message = `❤️ ${senderName} menyukai postingan Anda`;
                
                try {
                    await createNotification(
                        postData.user_id,
                        currentUser.id,
                        'like',
                        postId,
                        message,
                        '#'
                    );
                } catch (notifErr) {
                    console.warn('Gagal kirim notifikasi:', notifErr);
                }
            }
            
            showNotification('❤️ Like!');
        }
        
        // ============================================================
        // STEP 4: UPDATE UI / LOCAL DATA
        // ============================================================
        
        // Update userPosts (jika ada)
        const myPost = userPosts.find(p => p.id === postId);
        if (myPost) {
            myPost.likes_count = newCount;
            myPost.isLiked = !isCurrentlyLiked;
        }
        
        // Update allUserPosts (jika ada)
        const allPost = allUserPosts.find(p => p.postId === postId || p.id === postId);
        if (allPost) {
            allPost.likes_count = newCount;
            allPost.isLiked = !isCurrentlyLiked;
        }
        
        // Update stockItems (jika ada)
        const stockIndex = stockItems.findIndex(item => item.postId === postId);
        if (stockIndex !== -1) {
            stockItems[stockIndex].likes_count = newCount;
            stockItems[stockIndex].isLiked = !isCurrentlyLiked;
        }
        
        // Update button UI
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = newCount;
            }
            btnElement.classList.toggle('liked', !isCurrentlyLiked);
            btnElement.classList.remove('loading');
        }
        
        // Update semua tombol like dengan postId yang sama
        document.querySelectorAll(`.btn-like-stock[onclick*="${postId}"]`).forEach(btn => {
            if (btn !== btnElement) {
                const count = btn.querySelector('.like-count');
                if (count) count.textContent = newCount;
                btn.classList.toggle('liked', !isCurrentlyLiked);
            }
        });
        
        // Update profile stats (jika ini post sendiri)
        if (myPost || (postData.user_id === currentUser.id)) {
            updateProfileUI();
        }
        
    } catch (error) {
        console.error('❌ Like error:', error);
        showNotification('❌ Gagal: ' + (error.message || 'Terjadi kesalahan'));
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
};
*/
// ============================================================
// TOGGLE LIKE UNTUK STOCK - DIPERBAIKI
// ============================================================
window.toggleLikeStock = async function(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu untuk memberi like');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification(' Like hanya untuk postingan komunitas');
        return;
    }
    
    // Loading state
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        // PENTING: Cari post di SEMUA sumber dengan id yang sama
        // Prioritas: allUserPosts dulu (karena ini yang dipakai di stock)
        
        /*
        let post = allUserPosts.find(p => p.id === postId);
        let isMyPost = false;
        
        if (post) {
            isMyPost = (post.user_id === currentUser.id);
        } else {
            // Fallback: cari di userPosts (untuk halaman profil)
            post = userPosts.find(p => p.id === postId);
            if (post) isMyPost = true;
        
            
        }
        */
        // Cari post di semua sumber - cek p.id DAN p.postId untuk kompatibilitas
        
        
        /*
let post = allUserPosts.find(p => p.id === postId || p.postId === postId);
let isMyPost = false;

if (post) {
    isMyPost = (post.user_id === currentUser.id);
} else {
    // Fallback: cari di userPosts (untuk halaman profil)
    post = userPosts.find(p => p.id === postId);
    if (post) isMyPost = true;
}


        
        
        
        if (!post) {
            console.error('Post not found with id:', postId);
            showNotification('Postingan tidak ditemukan');
            if (btnElement) btnElement.classList.remove('loading');
            return;
        }
        */
// Cari post di semua sumber - cek p.id DAN p.postId untuk kompatibilitas
let post = allUserPosts.find(p => p.id === postId || p.postId === postId);
let isMyPost = false;

if (post) {
    isMyPost = (post.user_id === currentUser.id);
} else {
    // Fallback: cari di userPosts (untuk halaman profil)
    post = userPosts.find(p => p.id === postId);
    if (post) isMyPost = true;
}

if (!post) {
    console.error('Post not found with id:', postId);
    console.log('Available IDs in allUserPosts:', allUserPosts.map(p => p.id));
    showNotification('Postingan tidak ditemukan');
    if (btnElement) btnElement.classList.remove('loading');
    return;
}


        
        
        // Cek apakah sudah like
        const { data: existingLike, error: checkError } = await supabaseClient
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .maybeSingle();
        
        if (checkError && checkError.code !== 'PGRST116') throw checkError;
        
        if (existingLike) {
            // UNLIKE
            await supabaseClient
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
            
            const newCount = Math.max(0, (post.likes_count || 1) - 1);
            
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            post.likes_count = newCount;
            post.isLiked = false;
            
            // Update semua referensi
            updateAllLocalPosts(postId, newCount, false);
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE
            await supabaseClient
                .from('likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
            
            const newCount = (post.likes_count || 0) + 1;
            
            await supabaseClient
                .from('posts')
                .update({ likes_count: newCount })
                .eq('id', postId);
            
            post.likes_count = newCount;
            post.isLiked = true;
            
            // Update semua referensi
            updateAllLocalPosts(postId, newCount, true);
            
            // Kirim notifikasi ke pemilik (jika bukan milik sendiri)
            if (!isMyPost && post.user_id && post.user_id !== currentUser.id) {
                const senderName = currentUser.profile?.username || currentUser.email.split('@')[0];
                const message = `❤️ ${senderName} menyukai postingan Anda`;
                
                await createNotification(
                    post.user_id,
                    currentUser.id,
                    'like',
                    postId,
                    message,
                    '#'
                );
            }
            
            showNotification('❤️ Like!');
        }
        
        // Update UI
        updateProfileUI();
        renderUserPosts();
        
        // Update button
        if (btnElement) {
            const countSpan = btnElement.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = post.likes_count || 0;
            }
            btnElement.classList.toggle('liked', post.isLiked);
            btnElement.classList.remove('loading');
        }
        
    } catch (error) {
        console.error('Like error:', error);
        showNotification('Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
};

// ============================================================
// HELPER: Update semua referensi post
// ============================================================
function updateAllLocalPosts(postId, newCount, isLiked) {
    // Update di allUserPosts
    const allPost = allUserPosts.find(p => p.id === postId);
    if (allPost) {
        allPost.likes_count = newCount;
        allPost.isLiked = isLiked;
    }
    
    // Update di userPosts
    const myPost = userPosts.find(p => p.id === postId);
    if (myPost) {
        myPost.likes_count = newCount;
        myPost.isLiked = isLiked;
    }
    
    // Update di stockItems
    /*
    const stockIndex = stockItems.findIndex(item => item.id === postId && item.isUserPost);
    */
    
    /*
// Update di stockItems - cek id DAN postId
const stockIndex = stockItems.findIndex(item => 
    (item.id === postId || item.postId === postId) && item.isUserPost
);


    
    if (stockIndex !== -1) {
        stockItems[stockIndex].likes_count = newCount;
        stockItems[stockIndex].isLiked = isLiked;
    }
    */
// Update di stockItems - cek id DAN postId
const stockIndex = stockItems.findIndex(item => 
    (item.id === postId || item.postId === postId) && item.isUserPost
);
if (stockIndex !== -1) {
    stockItems[stockIndex].likes_count = newCount;
    stockItems[stockIndex].isLiked = isLiked;
}


    
    
    
    
    // Update di feedVideosData (jika ada)
    if (typeof feedVideosData !== 'undefined' && feedVideosData) {
        const feedItem = feedVideosData.find(v => v.id === postId);
        if (feedItem) {
            feedItem.likes = newCount;
            feedItem.isLiked = isLiked;
        }
    }
}




// ============================================================
// FETCH STOCK ITEMS - DENGAN USER POSTS (TANPA OVERRIDE DUPLIKAT)
// ============================================================

/*
// Gunakan flag untuk menghindari duplikasi
if (typeof window._stockFetchOverridden === 'undefined') {
    window._stockFetchOverridden = true;
    
    const originalFetchStockFn = fetchStockItems;
    fetchStockItems = async function() {
        await originalFetchStockFn();
        
        if (currentUser && userPosts.length > 0) {
            const userStockItems = userPosts.map(post => ({
                ...post,
                src: { 
                    medium: post.media_url,
                    large2x: post.media_url,
                    original: post.media_url
                },
                photographer: currentUser.profile?.username || currentUser.email.split('@')[0],
                alt: post.description || 'User post',
                type: 'photo',
                isUserPost: true,
                postId: post.id,
                likes_count: post.likes_count || 0,
                isLiked: post.isLiked || false
            }));
            
            const existingIds = new Set(stockItems.map(item => item.postId).filter(id => id));
            const newItems = userStockItems.filter(item => !existingIds.has(item.postId));
            stockItems = [...newItems, ...stockItems];
            renderStockItems(stockItems);
        }
    };
}
*/
// ============================================================
// FETCH STOCK ITEMS - DENGAN USER POSTS (TANPA OVERRIDE DUPLIKAT)
// ============================================================


// ============================================================
// FETCH STOCK ITEMS - DENGAN SEMUA USER POSTS
// ============================================================
/*
if (typeof window._stockFetchOverridden === 'undefined') {
    window._stockFetchOverridden = true;
    
    const originalFetchStockFn = fetchStockItems;
    fetchStockItems = async function() {
        // Panggil original (yang di apxz240726.js sudah load allUserPosts)
        await originalFetchStockFn();
        
        // Sync like status dari allUserPosts ke stockItems
        if (allUserPosts.length > 0 && stockItems.length > 0) {
            stockItems.forEach(item => {
                if (item.isUserPost && item.id) {
                    const matching = allUserPosts.find(p => p.id === item.id);
                    if (matching) {
                        item.likes_count = matching.likes_count || 0;
                        item.isLiked = matching.isLiked || false;
                    }
                }
            });
            // Tidak perlu render ulang, apxz240726.js sudah render
        }
    };
}
*/







// ============================================================
// SETTINGS MODAL
// ============================================================
function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeSettingsOutside(e) {
    if (e.target === document.getElementById('settingsModal')) {
        closeSettingsModal();
    }
}

// ============================================================
// LANGUAGE SETTING
// ============================================================
function setLanguage(lang, btn) {
    // Update active button
    document.querySelectorAll('.language-selector .lang-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    // Simpan preferensi bahasa
    localStorage.setItem('alovera_language', lang);
    
    // Terjemahkan konten sesuai bahasa
    applyLanguage(lang);
    showNotification(lang === 'id' ? ' Bahasa diubah ke Indonesia' : ' Language changed to English');
}

function applyLanguage(lang) {
    // Ini adalah contoh terjemahan sederhana
    // Anda bisa menambahkan lebih banyak terjemahan sesuai kebutuhan
    const translations = {
        id: {
            appName: 'Alovera',
            home: 'Beranda',
            shop: 'Toko',
            news: 'Berita',
            stock: 'Galeri',
            books: 'Perpustakaan',
            profile: 'Profil',
            feed: 'Feed',
            cart: 'Keranjang',
            search: 'Cari',
            login: 'Masuk',
            register: 'Daftar',
            logout: 'Keluar',
            editProfile: 'Edit Profil',
            settings: 'Pengaturan',
            language: 'Bahasa',
            theme: 'Tema',
            privacy: 'Kebijakan Privasi',
            help: 'Pusat Bantuan',
            about: 'Tentang'
        },
        en: {
            appName: 'Alovera',
            home: 'Home',
            shop: 'Shop',
            news: 'News',
            stock: 'Gallery',
            books: 'Library',
            profile: 'Profile',
            feed: 'Feed',
            cart: 'Cart',
            search: 'Search',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            editProfile: 'Edit Profile',
            settings: 'Settings',
            language: 'Language',
            theme: 'Theme',
            privacy: 'Privacy Policy',
            help: 'Help Center',
            about: 'About'
        }
    };
    
    const t = translations[lang] || translations.id;
    
    // Update elemen dengan data-translate
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // Update title
    document.title = t.appName;
}

// ============================================================
// THEME FROM SETTINGS
// ============================================================
function setThemeFromSettings(theme) {
    setTheme(theme);
    // Update active button di settings
    document.querySelectorAll('.settings-group .lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Cari tombol tema yang sesuai
    document.querySelectorAll('.settings-group .lang-btn').forEach(btn => {
        if (btn.textContent.includes(theme === 'dark' ? 'Gelap' : theme === 'light' ? 'Terang' : 'HUT')) {
            btn.classList.add('active');
        }
    });
    showNotification(' Tema diubah');
}

// ============================================================
// UPDATE UI FOR LOGGED IN - DENGAN SETTINGS
// ============================================================
function updateUIForLoggedIn() {
    const profile = currentUser.profile || {};
    const joinPrompt = document.getElementById('joinPrompt');
    
    if (joinPrompt) {
        joinPrompt.querySelector('h4').textContent = `👋 Selamat datang, ${profile.username || currentUser.email.split('@')[0]}`;
        joinPrompt.querySelector('p').textContent = 'Anda sudah login. Bagikan karya Anda sekarang!';
        joinPrompt.querySelector('.btn-join-small').style.display = 'none';
    }
    
    updateProfileUI();
    renderUserPosts();
}






// ============================================================
// LOAD ALL USER POSTS - UNTUK STOCK GALLERY
// ============================================================
let allUserPosts = []; // Semua posts dari semua user
let allUserProfiles = {}; // Map user_id -> profile


/*
async function loadAllUserPosts() {
    try {
        // Ambil semua posts
        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        if (!posts || posts.length === 0) {
            allUserPosts = [];
            return;
        }
        
        // Ambil semua user_id unik
        const userIds = [...new Set(posts.map(p => p.user_id).filter(id => id))];
        
        // Ambil profiles untuk user_id tersebut
        let profileMap = {};
        if (userIds.length > 0) {
            const { data: profiles, error: profileError } = await supabaseClient
                .from('profiles')
                .select('user_id, username, avatar_url')
                .in('user_id', userIds);
            
            if (!profileError && profiles) {
                profiles.forEach(p => {
                    profileMap[p.user_id] = {
                        username: p.username || 'User',
                        avatar_url: p.avatar_url || null
                    };
                });
            }
        }
        
        allUserProfiles = profileMap;
        
        // Format posts untuk stock items
        allUserPosts = posts.map(post => ({
            ...post,
            src: {
                medium: post.media_url,
                large2x: post.media_url,
                original: post.media_url
            },
            photographer: profileMap[post.user_id]?.username || 'User',
            alt: post.description || 'User post',
            type: post.media_type === 'video' ? 'video' : 'photo',
            isUserPost: true,
            postId: post.id,
            likes_count: post.likes_count || 0,
            isLiked: false
        }));
        
        console.log(`Loaded ${allUserPosts.length} user posts`);
        
    } catch (error) {
        console.error('Load all user posts error:', error);
        allUserPosts = [];
    }
}
*/


// ============================================================
// LOAD ALL USER POSTS - DENGAN STATUS LIKE
// ============================================================

/*
async function loadAllUserPosts() {
    try {
        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        if (!posts || posts.length === 0) {
            allUserPosts = [];
            return;
        }
        
        const userIds = [...new Set(posts.map(p => p.user_id).filter(id => id))];
        const postIds = posts.map(p => p.id);
        
        // Ambil profiles
        let profileMap = {};
        if (userIds.length > 0) {
            const { data: profiles, error: profileError } = await supabaseClient
                .from('profiles')
                .select('user_id, username, avatar_url')
                .in('user_id', userIds);
            
            if (!profileError && profiles) {
                profiles.forEach(p => {
                    profileMap[p.user_id] = {
                        username: p.username || 'User',
                        avatar_url: p.avatar_url || null
                    };
                });
            }
        }
        
        // Ambil likes user saat ini (untuk cek status like)
        let likedPostIds = new Set();
        if (currentUser && postIds.length > 0) {
            const { data: likes, error: likesError } = await supabaseClient
                .from('likes')
                .select('post_id')
                .eq('user_id', currentUser.id)
                .in('post_id', postIds);
            
            if (!likesError && likes) {
                likes.forEach(l => likedPostIds.add(l.post_id));
            }
        }
        
        allUserProfiles = profileMap;
        
        allUserPosts = posts.map(post => ({
            ...post,
            src: {
                medium: post.media_url,
                large2x: post.media_url,
                original: post.media_url
            },
            photographer: profileMap[post.user_id]?.username || 'User',
            alt: post.description || 'User post',
            type: post.media_type === 'video' ? 'video' : 'photo',
            isUserPost: true,
            postId: post.id,
            likes_count: post.likes_count || 0,
            isLiked: likedPostIds.has(post.id)
        }));
        
        console.log(`✅ Loaded ${allUserPosts.length} user posts`);
        
    } catch (error) {
        console.error('Load all user posts error:', error);
        allUserPosts = [];
    }
}
*/


// ============================================================
// LOAD ALL USER POSTS - PERBAIKAN
// ============================================================
async function loadAllUserPosts() {
    try {
        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        if (!posts || posts.length === 0) {
            allUserPosts = [];
            return;
        }
        
        const userIds = [...new Set(posts.map(p => p.user_id).filter(id => id))];
        const postIds = posts.map(p => p.id);
        
        // Ambil profiles
        let profileMap = {};
        if (userIds.length > 0) {
            const { data: profiles, error: profileError } = await supabaseClient
                .from('profiles')
                .select('user_id, username, avatar_url')
                .in('user_id', userIds);
            
            if (!profileError && profiles) {
                profiles.forEach(p => {
                    profileMap[p.user_id] = {
                        username: p.username || 'User',
                        avatar_url: p.avatar_url || null
                    };
                });
            }
        }
        
        // Cek status like untuk user saat ini
        let likedPostIds = new Set();
        if (currentUser && postIds.length > 0) {
            const { data: likes, error: likesError } = await supabaseClient
                .from('likes')
                .select('post_id')
                .eq('user_id', currentUser.id)
                .in('post_id', postIds);
            
            if (!likesError && likes) {
                likes.forEach(l => likedPostIds.add(l.post_id));
            }
        }
        
        allUserProfiles = profileMap;
        
        // PENTING: Gunakan field 'id' yang sama dengan Supabase
        // Jangan buat field baru 'postId' yang berbeda
        
        /*
        allUserPosts = posts.map(post => ({
            ...post,                          // Semua field asli termasuk 'id'
            src: {
                medium: post.media_url,
                large2x: post.media_url,
                original: post.media_url
            },
            photographer: profileMap[post.user_id]?.username || 'User',
            alt: post.description || 'User post',
            type: post.media_type === 'video' ? 'video' : 'photo',
            isUserPost: true,
            likes_count: post.likes_count || 0,
            isLiked: likedPostIds.has(post.id)
        }));
        */
        
        /*
allUserPosts = posts.map(post => ({
    ...post,                          // Semua field asli termasuk 'id'
    postId: post.id,                  // ✅ TAMBAHKAN INI!
    src: {
        medium: post.media_url,
        large2x: post.media_url,
        original: post.media_url
    },
    photographer: profileMap[post.user_id]?.username || 'User',
    alt: post.description || 'User post',
    type: post.media_type === 'video' ? 'video' : 'photo',
    isUserPost: true,
    likes_count: post.likes_count || 0,
    isLiked: likedPostIds.has(post.id)
}));
*/
allUserPosts = posts.map(post => ({
    ...post,                          // Semua field asli termasuk 'id'
    postId: post.id,                  // ✅ Tambahkan ini untuk kompatibilitas
    src: {
        medium: post.media_url,
        large2x: post.media_url,
        original: post.media_url
    },
    photographer: profileMap[post.user_id]?.username || 'User',
    alt: post.description || 'User post',
    type: post.media_type === 'video' ? 'video' : 'photo',
    isUserPost: true,
    likes_count: post.likes_count || 0,
    isLiked: likedPostIds.has(post.id)
}));


        
        
        console.log(`Loaded ${allUserPosts.length} user posts`);
        
    } catch (error) {
        console.error('Load all user posts error:', error);
        allUserPosts = [];
    }
}