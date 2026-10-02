// ============================================================
// NOTIFICATIONS - SUPABASE REALTIME
// ============================================================

let notifications = [];
let notifCount = 0;
let notifSubscription = null;
let notifChannel = null;

// ============================================================
// LOAD NOTIFICATIONS DARI SUPABASE
// ============================================================
async function loadNotifications() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('notifications')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        
        notifications = data || [];
        notifCount = notifications.filter(n => !n.read).length;
        updateNotifBadge();
        renderNotifications();
        saveNotificationsToLocal();
        
    } catch (error) {
        console.error('Load notifications error:', error);
        // Fallback ke localStorage
        loadNotificationsFromLocal();
    }
}

// ============================================================
// REALTIME SUBSCRIBE - NOTIFIKASI LANGSUNG
// ============================================================
function subscribeToNotifications() {
    if (!currentUser) return;
    
    // Unsubscribe dari channel lama jika ada
    if (notifChannel) {
        supabaseClient.removeChannel(notifChannel);
        notifChannel = null;
    }
    
    // Buat channel baru untuk notifikasi user
    notifChannel = supabaseClient
        .channel(`notifications:user:${currentUser.id}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${currentUser.id}`
            },
            (payload) => {
                // Notifikasi baru masuk!
                const newNotif = payload.new;
                notifications.unshift(newNotif);
                notifCount++;
                updateNotifBadge();
                renderNotifications();
                
                // Tampilkan toast notifikasi
                showNotification('🔔 ' + newNotif.message);
                
                // Play suara jika ada (opsional)
                playNotifSound();
            }
        )
        .subscribe((status) => {
            console.log('📡 Notifikasi channel status:', status);
        });
}

// ============================================================
// CREATE NOTIFICATION - SEND KE SUPABASE
// ============================================================

/*
async function createNotification(userId, senderId, type, postId, message, link = '#') {
    if (!userId || !senderId) return;
    if (userId === senderId) return; // Jangan notifikasi sendiri
    
    try {
        const { data, error } = await supabaseClient
            .from('notifications')
            .insert([{
                user_id: userId,
                sender_id: senderId,
                type: type,
                post_id: postId || null,
                message: message,
                link: link || '#',
                read: false
            }])
            
            */
async function createNotification(userId, senderId, type, postId, message, link = '#') {
    console.log('🔔 createNotification:', { userId, senderId, type, postId });
    
    if (!userId || !senderId) {
        console.warn('⚠️ userId atau senderId kosong');
        return;
    }
    if (userId === senderId) {
        console.warn('⚠️ Tidak bisa notif diri sendiri');
        return;
    }
    
    try {
        const insertData = {
            user_id: userId,
            sender_id: senderId,
            type: type,
            post_id: postId || null,
            message: message,
            link: link || '#',
            read: false
        };
        console.log('📤 Insert data:', insertData);
        
        const { data, error } = await supabaseClient
            .from('notifications')
            .insert([insertData])
            
            
            
            
            .select()
            .single();
        
        if (error) throw error;
        console.log(' Notifikasi terkirim:', data);
        return data;
        
    } catch (error) {
        console.error('Create notification error:', error);
        // Fallback ke localStorage
        addNotificationLocal(userId, type, message, link);
    }
}

// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================
async function markNotificationRead(notifId) {
    try {
        const { error } = await supabaseClient
            .from('notifications')
            .update({ read: true })
            .eq('id', notifId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        // Update local
        const notif = notifications.find(n => n.id === notifId);
        if (notif) notif.read = true;
        notifCount = notifications.filter(n => !n.read).length;
        updateNotifBadge();
        
    } catch (error) {
        console.error('Mark read error:', error);
    }
}

// ============================================================
// MARK ALL AS READ
// ============================================================
async function markAllNotificationsRead() {
    if (notifications.length === 0) return;
    
    try {
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) return;
        
        const { error } = await supabaseClient
            .from('notifications')
            .update({ read: true })
            .in('id', unreadIds)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        notifications.forEach(n => n.read = true);
        notifCount = 0;
        updateNotifBadge();
        renderNotifications();
        
    } catch (error) {
        console.error('Mark all read error:', error);
    }
}

// ============================================================
// DELETE NOTIFICATION
// ============================================================
async function deleteNotification(notifId) {
    try {
        const { error } = await supabaseClient
            .from('notifications')
            .delete()
            .eq('id', notifId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        notifications = notifications.filter(n => n.id !== notifId);
        notifCount = notifications.filter(n => !n.read).length;
        updateNotifBadge();
        renderNotifications();
        
    } catch (error) {
        console.error('Delete notification error:', error);
    }
}

// ============================================================
// FALLBACK: LOCAL STORAGE (OFFLINE MODE)
// ============================================================
function saveNotificationsToLocal() {
    try {
        localStorage.setItem('alovera_notifications', JSON.stringify(notifications));
        localStorage.setItem('alovera_notif_count', String(notifCount));
    } catch (e) {}
}

function loadNotificationsFromLocal() {
    try {
        const saved = localStorage.getItem('alovera_notifications');
        if (saved) {
            notifications = JSON.parse(saved);
            notifCount = notifications.filter(n => !n.read).length;
            updateNotifBadge();
            renderNotifications();
        }
    } catch (e) {}
}

function addNotificationLocal(userId, type, message, link = '#') {
    const notif = {
        id: 'local-' + Date.now(),
        user_id: userId,
        sender_id: currentUser?.id || 'system',
        type: type,
        message: message,
        link: link,
        read: false,
        created_at: new Date().toISOString()
    };
    notifications.unshift(notif);
    if (userId === currentUser?.id) {
        notifCount++;
        updateNotifBadge();
        renderNotifications();
    }
    saveNotificationsToLocal();
}

// ============================================================
// PLAY SOUND NOTIF (OPSIONAL)
// ============================================================
function playNotifSound() {
    try {
        const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dX////////////////////////////////8AAAAATGF2YzU4LjE4AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90b0AAAAA');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch (e) {}
}

// ============================================================
// UPDATE NOTIF BADGE
// ============================================================

/*
function updateNotifBadge() {
    const dot = document.getElementById('notifDot');
    if (dot) {
        if (notifCount > 0) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    }
    // Update badge di header (opsional)
    const badge = document.querySelector('.badge-header');
    if (badge && notifCount > 0) {
        // Jika ada badge notifikasi terpisah
    }
}
*/

// ============================================================
// OPEN NOTIFICATION MODAL
// ============================================================
function openNotificationModal() {
    const modal = document.getElementById('notifModal');
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Mark all as read
    markAllNotificationsRead();
    
    renderNotifications();
}

function closeNotificationModal() {
    document.getElementById('notifModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeNotifOutside(e) {
    if (e.target === document.getElementById('notifModal')) {
        closeNotificationModal();
    }
}

// ============================================================
// RENDER NOTIFICATIONS
// ============================================================
function renderNotifications() {
    const container = document.getElementById('notifList');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="notif-empty">
                <i class="fas fa-inbox"></i>
                <p>Belum ada notifikasi</p>
            </div>
        `;
        return;
    }
    
    const icons = {
        like: { class: 'like', icon: 'fa-heart' },
        post: { class: 'post', icon: 'fa-upload' },
        comment: { class: 'comment', icon: 'fa-comment' },
        follow: { class: 'follow', icon: 'fa-user-plus' }
    };
    
    container.innerHTML = notifications.map(n => {
        const icon = icons[n.type] || icons.post;
        const time = new Date(n.created_at).toLocaleString('id-ID');
        const isRead = n.read ? '' : 'style="background:rgba(74,222,128,0.03);border-left:3px solid #4ade80;"';
        
        return `
            <div class="notif-item" ${isRead} onclick="window.location.href='${n.link || '#'}'">
                <div class="notif-icon ${icon.class}">
                    <i class="fas ${icon.icon}"></i>
                </div>
                <div class="notif-body">
                    <div class="notif-text">${n.message}</div>
                    <div class="notif-time">${time}</div>
                </div>
                <button onclick="event.stopPropagation(); deleteNotification('${n.id}')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
    
    saveNotificationsToLocal();
}

// ============================================================
// INTEGRASI DENGAN LIKE - KIRIM NOTIFIKASI
// ============================================================
// Modifikasi fungsi toggleLikeStock untuk mengirim notifikasi

/*
const originalToggleLikeStock = window.toggleLikeStock;
window.toggleLikeStock = async function(postId, btnElement, isUserPost = true) {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    if (!postId || !isUserPost) {
        showNotification('💡 Like hanya untuk postingan komunitas');
        return;
    }
    
    const postIndex = userPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        showNotification('Postingan tidak ditemukan');
        return;
    }
    
    const post = userPosts[postIndex];
    const isCurrentlyLiked = post.isLiked || false;
    
    if (btnElement) {
        btnElement.classList.add('loading');
    }
    
    try {
        if (isCurrentlyLiked) {
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
            
            showNotification('❤️ Like dibatalkan');
            
        } else {
            // LIKE - KIRIM NOTIFIKASI
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
            
            // KIRIM NOTIFIKASI KE PEMILIK POST
            const postOwnerId = post.user_id;
            const senderName = currentUser.profile?.username || currentUser.email.split('@')[0];
            const message = `❤️ ${senderName} menyukai postingan Anda: "${post.description?.substring(0, 30) || ''}..."`;
            const link = `#`;
            
            await createNotification(
                postOwnerId,
                currentUser.id,
                'like',
                postId,
                message,
                link
            );
            
            showNotification('❤️ Like!');
        }
        
        updateProfileUI();
        renderUserPosts();
        
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
        showNotification(' Gagal: ' + error.message);
        if (btnElement) {
            btnElement.classList.remove('loading');
        }
    }
};
*/



// ============================================================
// INTEGRASI DENGAN POSTINGAN - NOTIFIKASI POSTINGAN BARU
// ============================================================

/*
const originalHandleUploadPost = handleUploadPost;
handleUploadPost = async function(e) {
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
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (uploadError) throw uploadError;
        
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
        
        // KIRIM NOTIFIKASI KE SEMUA FOLLOWERS (jika ada fitur follow)
        // Untuk sekarang, kita kirim notifikasi ke admin atau sistem
        const senderName = currentUser.profile?.username || currentUser.email.split('@')[0];
        const message = `📷 ${senderName} membagikan postingan baru: "${description?.substring(0, 30) || ''}..."`;
        
        // Kirim notifikasi ke admin (opsional)
        // await createNotification('admin-user-id', currentUser.id, 'post', postData.id, message, '#');
        
        showNotification(' Postingan berhasil diupload!');
        closeUploadModal();
        
        await loadUserProfileData();
        updateProfileUI();
        renderUserPosts();
        
        if (document.getElementById('feedPage')?.classList.contains('active')) {
            feedVideosData = [];
            loadFeedVideosData(true);
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showNotification(' Gagal upload: ' + error.message);
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Posting';
};
*/



// ============================================================
// INIT NOTIFICATIONS - SAAT USER LOGIN
// ============================================================
function initNotifications() {
    if (currentUser) {
        loadNotifications();
        subscribeToNotifications();
    }
}

// Panggil initNotifications setelah login
const originalCheckAuth = checkAuthStatus;
checkAuthStatus = async function() {
    await originalCheckAuth();
    if (currentUser) {
        initNotifications();
    }
};

// ============================================================
// CLEANUP - UNSUBSCRIBE SAAT LOGOUT
// ============================================================
const originalLogoutUser = logoutUser;
logoutUser = async function() {
    if (notifChannel) {
        supabaseClient.removeChannel(notifChannel);
        notifChannel = null;
    }
    await originalLogoutUser();
};

console.log('🔔 Realtime Notifications module loaded!');




// ============================================================
// UPDATE NOTIF BADGE - UNTUK HEADER DAN PROFIL
// ============================================================
function updateNotifBadge() {
    // Dot di header (jika masih ada)
    const headerDot = document.getElementById('notifDot');
    if (headerDot) {
        if (notifCount > 0) {
            headerDot.classList.add('active');
        } else {
            headerDot.classList.remove('active');
        }
    }
    
    // Dot di profil
    const profileDot = document.getElementById('notifDotProfile');
    if (profileDot) {
        if (notifCount > 0) {
            profileDot.classList.add('active');
        } else {
            profileDot.classList.remove('active');
        }
    }
}

// ============================================================
// UPDATE PROFILE UI - TAMPILKAN TOMBOL YANG SESUAI
// ============================================================
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
        document.getElementById('notifProfileBtn').style.display = 'none';
        document.getElementById('settingsBtn').style.display = 'none';
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
    
    
    
    
    /*
    document.getElementById('profileNameDisplay').textContent = profile.username || currentUser.email.split('@')[0];
    document.getElementById('profileEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileBioDisplay').textContent = profile.bio || 'Belum ada bio';
    
    // TAMPILKAN TOMBOL: Edit Profil, Notifikasi, Pengaturan
    document.getElementById('editProfileBtn').style.display = 'inline-flex';
    document.getElementById('notifProfileBtn').style.display = 'inline-flex';
    document.getElementById('settingsBtn').style.display = 'inline-flex';
    
    // Update badge notifikasi di profil
    updateNotifBadge();
    
    // Stats
    let totalLikes = 0;
    userPosts.forEach(post => { totalLikes += post.likes_count || 0; });
    document.getElementById('statKarya').textContent = userPosts.length;
    document.getElementById('statLikes').textContent = totalLikes;
}

*/
    document.getElementById('profileNameDisplay').textContent = profile.username || currentUser.email.split('@')[0];
    document.getElementById('profileEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileBioDisplay').textContent = profile.bio || 'Belum ada bio';
    
    // TAMPILKAN SEMUA 3 TOMBOL
    document.getElementById('editProfileBtn').style.display = 'inline-flex';
    document.getElementById('notifProfileBtn').style.display = 'inline-flex';
    document.getElementById('settingsBtn').style.display = 'inline-flex';
    
    // Update badge notifikasi di profil
    updateNotifBadge();
    
    // Stats
    let totalLikes = 0;
    userPosts.forEach(post => { totalLikes += post.likes_count || 0; });
    document.getElementById('statKarya').textContent = userPosts.length;
    document.getElementById('statLikes').textContent = totalLikes;
    
    // ✅ TAMBAHAN: Update Settings Profile Card juga
    updateSettingsProfileCard(profile, currentUser);
}

// ============================================================
// UPDATE SETTINGS PROFILE CARD
// ============================================================
function updateSettingsProfileCard(profile, user) {
    const settingsAvatar = document.getElementById('settingsAvatar');
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    
    if (!settingsAvatar || !settingsName || !settingsEmail) return;
    
    const username = profile?.username || user?.email?.split('@')[0] || 'Pengunjung';
    const email = user?.email || '-';
    const avatarLetter = (username || 'U')[0].toUpperCase();
    
    // Update avatar
    if (profile?.avatar_url) {
        settingsAvatar.style.backgroundImage = `url(${profile.avatar_url})`;
        settingsAvatar.style.backgroundSize = 'cover';
        settingsAvatar.style.backgroundPosition = 'center';
        settingsAvatar.textContent = '';
    } else {
        settingsAvatar.style.backgroundImage = 'none';
        settingsAvatar.style.background = 'linear-gradient(135deg, #0f3b1a, #1a6b3c)';
        settingsAvatar.textContent = avatarLetter;
    }
    
    // Update name & email
    settingsName.textContent = username;
    settingsEmail.textContent = email;
}

// ============================================================
// UPDATE SETTINGS PROFILE CARD - GUEST STATE
// ============================================================
function resetSettingsProfileCard() {
    const settingsAvatar = document.getElementById('settingsAvatar');
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    
    if (settingsAvatar) {
        settingsAvatar.style.backgroundImage = 'none';
        settingsAvatar.style.background = 'linear-gradient(135deg, #0f3b1a, #1a6b3c)';
        settingsAvatar.textContent = 'U';
    }
    if (settingsName) settingsName.textContent = 'Pengunjung';
    if (settingsEmail) settingsEmail.textContent = '-';
}







// ============================================================
// SETTINGS DETAIL MODAL
// ============================================================
function openSettingsDetail(type) {
    const modal = document.getElementById('settingsDetailModal');
    if (!modal) return;
    
    const titleEl = document.getElementById('sdTitle');
    const subtitleEl = document.getElementById('sdSubtitle');
    const bodyEl = document.getElementById('sdBody');
    
    if (!titleEl || !subtitleEl || !bodyEl) return;
    
    // Konten berdasarkan tipe
    const contents = {
        account: {
            title: 'Akun',
            subtitle: 'Kelola informasi akun Anda',
            body: `
                <div class="sd-option" onclick="closeSettingsDetail(); openEditProfileModal();">
                    <span class="sd-option-label"><i class="fas fa-user"></i> Edit Profil</span>
                    <span class="sd-option-value"><i class="fas fa-chevron-right"></i></span>
                </div>
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-envelope"></i> Email</span>
                    <span class="sd-option-value">${currentUser?.email || '-'}</span>
                </div>
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-user-tag"></i> Username</span>
                    <span class="sd-option-value">${currentUser?.profile?.username || '-'}</span>
                </div>
                <div class="sd-option" onclick="changePassword()">
                    <span class="sd-option-label"><i class="fas fa-key"></i> Ubah Kata Sandi</span>
                    <span class="sd-option-value"><i class="fas fa-chevron-right"></i></span>
                </div>
            `
        },
        privacy: {
            title: 'Privasi',
            subtitle: 'Kelola privasi akun Anda',
            body: `
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-eye"></i> Profil Publik</span>
                    <div class="sd-toggle active" onclick="toggleSetting(this)">
                        <div class="sd-toggle-ball"></div>
                    </div>
                </div>
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-search"></i> Muncul di Pencarian</span>
                    <div class="sd-toggle active" onclick="toggleSetting(this)">
                        <div class="sd-toggle-ball"></div>
                    </div>
                </div>
                <div class="sd-option" onclick="window.location.href='privvcy.html'">
                    <span class="sd-option-label"><i class="fas fa-file-contract"></i> Kebijakan Privasi</span>
                    <span class="sd-option-value"><i class="fas fa-chevron-right"></i></span>
                </div>
            `
        },
        appearance: {
            title: 'Tampilan & Tema',
            subtitle: 'Pilih tema favorit Anda',
            body: `
                <div class="sd-option" onclick="setThemeFromSettings('dark'); closeSettingsDetail();">
                    <span class="sd-option-label"><i class="fas fa-moon"></i> Gelap</span>
                    <span class="sd-option-value ${getCurrentTheme() === 'dark' ? 'active' : ''}">
                        ${getCurrentTheme() === 'dark' ? '<i class="fas fa-check"></i>' : ''}
                    </span>
                </div>
                <div class="sd-option" onclick="setThemeFromSettings('light'); closeSettingsDetail();">
                    <span class="sd-option-label"><i class="fas fa-sun"></i> Terang</span>
                    <span class="sd-option-value ${getCurrentTheme() === 'light' ? 'active' : ''}">
                        ${getCurrentTheme() === 'light' ? '<i class="fas fa-check"></i>' : ''}
                    </span>
                </div>
                <div class="sd-option" onclick="setThemeFromSettings('hutri'); closeSettingsDetail();">
                    <span class="sd-option-label">🇮🇩 HUT RI</span>
                    <span class="sd-option-value ${getCurrentTheme() === 'hutri' ? 'active' : ''}">
                        ${getCurrentTheme() === 'hutri' ? '<i class="fas fa-check"></i>' : ''}
                    </span>
                </div>
            `
        },
        language: {
            title: 'Bahasa Aplikasi',
            subtitle: 'Pilih bahasa yang Anda inginkan',
            body: `
                <div class="sd-option" onclick="setLanguage('id', this); closeSettingsDetail();">
                    <span class="sd-option-label">🇮🇩 Indonesia</span>
                    <span class="sd-option-value ${getCurrentLanguage() === 'id' ? 'active' : ''}">
                        ${getCurrentLanguage() === 'id' ? '<i class="fas fa-check"></i>' : ''}
                    </span>
                </div>
                <div class="sd-option" onclick="setLanguage('en', this); closeSettingsDetail();">
                    <span class="sd-option-label">🇬🇧 English</span>
                    <span class="sd-option-value ${getCurrentLanguage() === 'en' ? 'active' : ''}">
                        ${getCurrentLanguage() === 'en' ? '<i class="fas fa-check"></i>' : ''}
                    </span>
                </div>
            `
        },
        notifications: {
            title: 'Notifikasi',
            subtitle: 'Kelola preferensi notifikasi',
            body: `
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-heart"></i> Notifikasi Like</span>
                    <div class="sd-toggle active" onclick="toggleSetting(this)">
                        <div class="sd-toggle-ball"></div>
                    </div>
                </div>
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-upload"></i> Notifikasi Postingan</span>
                    <div class="sd-toggle active" onclick="toggleSetting(this)">
                        <div class="sd-toggle-ball"></div>
                    </div>
                </div>
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-comment"></i> Notifikasi Komentar</span>
                    <div class="sd-toggle active" onclick="toggleSetting(this)">
                        <div class="sd-toggle-ball"></div>
                    </div>
                </div>
                <div class="sd-option">
                    <span class="sd-option-label"><i class="fas fa-user-plus"></i> Notifikasi Follow</span>
                    <div class="sd-toggle active" onclick="toggleSetting(this)">
                        <div class="sd-toggle-ball"></div>
                    </div>
                </div>
            `
        },
        storage: {
            title: 'Penyimpanan & Data',
            subtitle: 'Kelola data aplikasi',
            body: `
                <div class="sd-option" onclick="clearAppCache()">
                    <span class="sd-option-label"><i class="fas fa-broom"></i> Bersihkan Cache</span>
                    <span class="sd-option-value"><i class="fas fa-chevron-right"></i></span>
                </div>
                <div class="sd-option" onclick="clearFeedCache()">
                    <span class="sd-option-label"><i class="fas fa-video"></i> Bersihkan Cache Video</span>
                    <span class="sd-option-value"><i class="fas fa-chevron-right"></i></span>
                </div>
                <div class="sd-option" onclick="showStorageInfo()">
                    <span class="sd-option-label"><i class="fas fa-info-circle"></i> Info Penyimpanan</span>
                    <span class="sd-option-value"><i class="fas fa-chevron-right"></i></span>
                </div>
            `
        }
    };
    
    const content = contents[type];
    if (!content) {
        console.warn('Unknown settings detail type:', type);
        return;
    }
    
    titleEl.textContent = content.title;
    subtitleEl.textContent = content.subtitle;
    bodyEl.innerHTML = content.body;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSettingsDetail() {
    const modal = document.getElementById('settingsDetailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeSettingsDetailOutside(e) {
    if (e.target === document.getElementById('settingsDetailModal')) {
        closeSettingsDetail();
    }
}

// Helper: Toggle switch di dalam modal
function toggleSetting(el) {
    if (!el) return;
    el.classList.toggle('active');
    // Simpan preferensi
    const label = el.closest('.sd-option')?.querySelector('.sd-option-label')?.textContent?.trim();
    if (label) {
        const key = 'alovera_setting_' + label;
        localStorage.setItem(key, el.classList.contains('active') ? 'on' : 'off');
    }
}

// Helper: Get current theme
function getCurrentTheme() {
    return localStorage.getItem('alovera_theme') || 'dark';
}

// Helper: Get current language
function getCurrentLanguage() {
    return localStorage.getItem('alovera_language') || 'id';
}

// Helper: Change password
async function changePassword() {
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        return;
    }
    
    const newPassword = prompt('Masukkan kata sandi baru (minimal 6 karakter):');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        showNotification('Kata sandi minimal 6 karakter');
        return;
    }
    
    try {
        const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
        if (error) throw error;
        showNotification('✅ Kata sandi berhasil diubah');
    } catch (error) {
        console.error('Change password error:', error);
        showNotification('❌ Gagal: ' + error.message);
    }
}

// Helper: Clear app cache
function clearAppCache() {
    if (!confirm('Yakin ingin membersihkan cache? Data tidak akan terhapus.')) return;
    
    // Hapus cache
    const cacheKeys = ['alovera_feed_v3', 'feed_videos_data', 'saham_feed_videos_data'];
    cacheKeys.forEach(key => localStorage.removeItem(key));
    
    showNotification('✅ Cache berhasil dibersihkan');
    closeSettingsDetail();
}

// Helper: Clear feed cache khusus
function clearFeedCache() {
    localStorage.removeItem('alovera_feed_v3');
    localStorage.removeItem('feed_videos_data');
    localStorage.removeItem('saham_feed_videos_data');
    showNotification('✅ Cache video dibersihkan');
}

// Helper: Show storage info
function showStorageInfo() {
    let totalSize = 0;
    let items = 0;
    
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += (localStorage[key]?.length || 0) * 2; // bytes (approx UTF-16)
            items++;
        }
    }
    
    const sizeKB = (totalSize / 1024).toFixed(2);
    showNotification(`📊 ${items} item, ${sizeKB} KB`);
}

console.log('⚙️ Settings Detail module loaded!');