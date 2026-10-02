// ============================================================
// ALOVERA FEED VIDEO
// RANDOM DISCOVERY FEED - PEXELS
// ============================================================
//
// Konsep:
// - Banyak kategori/topik
// - Tidak mengulang kategori terlalu cepat
// - Tidak menampilkan video Pexels yang sama
// - Setiap batch berisi campuran beberapa kategori
// - Infinite scroll
// - Autoplay video yang sedang terlihat
// - Pause video yang keluar layar
// - Like & Share tetap kompatibel
// - Cache diperbaiki
// - Refresh benar-benar menghapus cache
// ============================================================


// ============================================================
// STATE FEED
// ============================================================

let feedVideosData = [];
let feedCurrentIndexData = 0;

let feedIsLoadingData = false;
let feedPageData = 1;
let feedHasMoreData = true;

let feedObserversData = [];

let feedInitializedData = false;

// Topic history
let feedRecentTopicsData = [];

// Video ID yang sudah pernah ditampilkan
let feedSeenVideoIdsData = new Set();




// ============================================================
// STATE KATEGORI FEED
// ============================================================
let feedCurrentCategoryData = 'foryou'; // default: "Untuk Kamu"
let feedCategoriesData = [
    { id: 'foryou',    label: 'Untuk Kamu', icon: 'fa-fire',        topics: null }, // null = random semua
    
    
    { id: 'humor',     label: 'Humor',      icon: 'fa-face-laugh',  topics: ['funny', 'comedy', 'funny animals', 'prank', 'meme'] },
    

    
    { id: 'kuliner',   label: 'Kuliner',    icon: 'fa-utensils',    topics: ['food', 'cooking', 'chef', 'street food', 'dessert'] },
    { id: 'travel',    label: 'Travel',     icon: 'fa-plane',       topics: ['travel', 'adventure', 'destination', 'tropical', 'road trip'] },
    { id: 'musik',     label: 'Musik',      icon: 'fa-music',       topics: ['music', 'guitar', 'piano', 'concert', 'musician'] },
    
    
    
    { id: 'olahraga',  label: 'Olahraga',   icon: 'fa-futbol',      topics: ['sports', 'football', 'basketball', 'fitness', 'workout'] },
    
    
    
    
    { id: 'seni',      label: 'Seni',       icon: 'fa-palette',     topics: ['art', 'painting', 'drawing', 'creative', 'design'] },
    { id: 'teknologi', label: 'Teknologi',  icon: 'fa-microchip',   topics: ['technology', 'AI', 'robot', 'gadget', 'innovation'] },
    

    { id: 'bisnis',    label: 'Bisnis',     icon: 'fa-briefcase',   topics: ['business', 'entrepreneur', 'startup', 'marketing', 'office'] },
    { id: 'finansial', label: 'Finansial',  icon: 'fa-coins',       topics: ['money', 'finance', 'investment', 'crypto', 'stock market'] },
    
    
    
    { id: 'alam',      label: 'Alam',       icon: 'fa-mountain',    topics: ['nature', 'landscape', 'mountains', 'ocean', 'forest'] },
    { id: 'hewan',     label: 'Hewan',      icon: 'fa-paw',         topics: ['animals', 'wildlife', 'pets', 'birds', 'cute animals'] },
    
    
    { id: 'mobil',     label: 'Mobil',      icon: 'fa-car',         topics: ['cars', 'supercars', 'racing', 'automotive', 'luxury cars'] },
    { id: 'edukasi',   label: 'Edukasi',    icon: 'fa-graduation-cap', topics: ['education', 'learning', 'science', 'study', 'knowledge'] },
];









// Cache
const FEED_CACHE_KEY = 'alovera_feed_v3';
const FEED_CACHE_TIME = 5 * 60 * 1000;

// Jumlah video setiap batch
const FEED_BATCH_SIZE = 15;

// Jumlah query/category yang digunakan setiap batch
const FEED_TOPIC_COUNT = 5;


// ============================================================
// TOPIK FEED
// ============================================================

const feedTopicsData = [

    {
        category: 'nature',
        queries: [
            'beautiful nature',
            'beautiful landscape',
            'mountains',
            'waterfall',
            'forest',
            'ocean waves',
            'sunset',
            'sunrise',
            'beautiful lake',
            'river nature'
        ]
    },

    {
        category: 'animals',
        queries: [
            'cute animals',
            'funny animals',
            'cute cats',
            'cute dogs',
            'wild animals',
            'wildlife',
            'birds',
            'pets',
            'animal behavior'
        ]
    },

    {
        category: 'travel',
        queries: [
            'travel adventure',
            'beautiful places',
            'travel destination',
            'tropical island',
            'road trip',
            'city travel',
            'travel lifestyle',
            'tourist destination'
        ]
    },

    {
        category: 'food',
        queries: [
            'delicious food',
            'street food',
            'cooking',
            'chef cooking',
            'food preparation',
            'dessert',
            'coffee',
            'restaurant food'
        ]
    },

    {
        category: 'technology',
        queries: [
            'technology',
            'artificial intelligence',
            'robot technology',
            'future technology',
            'robotics',
            'smartphone technology',
            'computer technology',
            'innovation technology'
        ]
    },

    {
        category: 'space',
        queries: [
            'space',
            'galaxy',
            'universe',
            'astronomy',
            'planet',
            'stars',
            'rocket launch',
            'space technology'
        ]
    },

    {
        category: 'sports',
        queries: [
            'sports',
            'football',
            'basketball',
            'soccer',
            'tennis',
            'skateboard',
            'surfing',
            'extreme sports'
        ]
    },

    {
        category: 'cars',
        queries: [
            'luxury cars',
            'sports cars',
            'supercars',
            'classic cars',
            'car driving',
            'car racing',
            'electric cars',
            'automotive'
        ]
    },

    {
        category: 'fitness',
        queries: [
            'fitness',
            'workout',
            'gym',
            'running',
            'yoga',
            'exercise',
            'healthy lifestyle',
            'fitness motivation'
        ]
    },

    {
        category: 'fashion',
        queries: [
            'fashion',
            'street fashion',
            'fashion model',
            'fashion style',
            'clothing',
            'fashion show',
            'modern fashion'
        ]
    },

    {
        category: 'art',
        queries: [
            'art',
            'digital art',
            'painting',
            'drawing',
            'creative art',
            'artist',
            'sculpture',
            'creative design'
        ]
    },

    {
        category: 'architecture',
        queries: [
            'modern architecture',
            'beautiful architecture',
            'futuristic architecture',
            'modern house',
            'city architecture',
            'luxury house',
            'interior design'
        ]
    },

    {
        category: 'lifestyle',
        queries: [
            'daily lifestyle',
            'morning routine',
            'beautiful home',
            'minimalist lifestyle',
            'coffee lifestyle',
            'people lifestyle',
            'relaxing lifestyle'
        ]
    },

    {
        category: 'adventure',
        queries: [
            'adventure',
            'hiking',
            'camping',
            'mountain adventure',
            'exploration',
            'outdoor adventure',
            'extreme adventure'
        ]
    },

    {
        category: 'science',
        queries: [
            'science',
            'scientific experiment',
            'laboratory',
            'physics',
            'biology',
            'science technology',
            'interesting science'
        ]
    },

    {
        category: 'music',
        queries: [
            'music performance',
            'musician',
            'guitar performance',
            'piano performance',
            'concert',
            'music studio',
            'drummer'
        ]
    },

    {
        category: 'funny',
        queries: [
            'funny moments',
            'funny animals',
            'comedy',
            'funny fails',
            'funny cats',
            'funny dogs',
            'prank comedy'
        ]
    },

    {
        category: 'interesting',
        queries: [
            'interesting facts',
            'amazing things',
            'amazing discovery',
            'satisfying video',
            'incredible moments',
            'amazing skills',
            'unusual things'
        ]
    },

    {
        category: 'ocean',
        queries: [
            'ocean',
            'underwater',
            'sea life',
            'coral reef',
            'diving',
            'beautiful beach',
            'ocean waves'
        ]
    },

    {
        category: 'city',
        queries: [
            'city life',
            'beautiful city',
            'night city',
            'city lights',
            'urban life',
            'downtown',
            'street life'
        ]
    },

    {
        category: 'people',
        queries: [
            'people lifestyle',
            'people walking',
            'daily life',
            'friends',
            'happy people',
            'street people',
            'human moments'
        ]
    },

    {
        category: 'creative',
        queries: [
            'creative process',
            'creative ideas',
            'craft',
            'handmade',
            'creative work',
            'design process',
            'creative studio'
        ]
    }

];


// ============================================================
// DESKRIPSI FEED
// ============================================================

const feedDescriptionsData = {

    nature: [
        '🌳 Keindahan alami yang menyejukkan.',
        '🌄 Pemandangan yang wajib dilihat.',
        '🌊 Pesonanya selalu punya cara untuk memukau.',
        '✨ Indahnya dunia dari sudut berbeda.'
    ],

    animals: [
        '📢 Hewan apa ya namanya?.',
        '🐱 Dunia hewan memang menarik.',
        '😂 Mau ngapain dia.',
        '❤️ Siapa yang tidak gemas?'
    ],

    travel: [
        '✈️ Kalau ada kesempatan, mau ke jalan bareng?',
        '🌍 Dunia begitu luas untuk dijelajahi.',
        '📍 Tempat menarik untuk masuk wishlist.',
        '✨ Sudut dunia yang luar biasa.'
    ],

    food: [
        '🍜 Kelihatannya menggugah selera.',
        '🤤 Siapa yang mau coba?',
        '🍳 Proses memasak yang menarik.',
        '☕ Cocok untuk pecinta kuliner.'
    ],

    technology: [
        '🤖 Teknologi terus berkembang.',
        '🚀 Masa depan semakin dekat.',
        '💡 Inovasi yang menarik untuk diperhatikan.',
        '⚡ Teknologi mengubah cara kita hidup.'
    ],

    space: [
        '🌌 Alam semesta memang luar biasa.',
        '🚀 Seberapa jauh manusia bisa menjelajah?',
        '✨ Ada begitu banyak hal yang belum kita ketahui.',
        '🌠 Menakjubkan.'
    ],

    sports: [
        '🔥 Aksi yang luar biasa!',
        '🏆 Semangat dan skill dalam satu video.',
        '⚡ Gerakannya cepat sekali.',
        '💪 Skill seperti ini tidak mudah.'
    ],

    cars: [
        '🚗 Mobil impian?',
        '🔥 Desain yang luar biasa.',
        '🏎️ Pecinta otomotif pasti suka.',
        '⚡ Kecepatan dan gaya.'
    ],

    fitness: [
        '🎉 Tetap semangat!',
        '📝 Belajar lebih baik yaa.',
        '🏃 Terus tumbuh, setiap hari.',
        '⚡ Energi positif hari ini.'
    ],

    fashion: [
        '✨ Style yang menarik.',
        '🥋 Inspirasi fashion hari ini.',
        '🔥 Look yang berbeda.',
        '💎 Simple tapi stylish.'
    ],

    art: [
        '🎨 Kreativitas tidak memiliki batas.',
        '✨ Sebuah karya yang menarik.',
        '🖌️ Proses kreatif selalu menarik.',
        '💡 Ide sederhana bisa menjadi luar biasa.'
    ],

    architecture: [
        '🏙️ Desain yang menarik perhatian.',
        '🏠 Arsitektur modern memang menarik.',
        '✨ Desain yang luar biasa.',
        '🌆 Kota dari sudut berbeda.'
    ],

    lifestyle: [
        '☕ Momen sederhana yang menyenangkan.',
        '✨ Daily life yang menarik.',
        '🥹 Nikmati setiap momen.',
        '😊 Simple but beautiful.'
    ],

    adventure: [
        '🏔️ Berani mencoba?',
        '🔥 Petualangan dimulai.',
        '🌍 Jangan takut menjelajah.',
        '⚡ Adrenalin!'
    ],

    science: [
        '🧪 Sains selalu menarik untuk dipelajari.',
        '🔬 Bagaimana hal ini bisa terjadi?',
        '💡 Pengetahuan baru hari ini.',
        '📖 Menarik dan estetik.'
    ],

    music: [
        '🎵 Musik menyatukan banyak orang.',
        '🎸 Tonton dan nikmati.',
        '🎶 Vibes hari ini.',
        '🔥 Performanya luar biasa.'
    ],

    funny: [
        '😂 Ini tidak terduga!',
        '🤣 Bikin senyum sendiri.',
        '😆 Ada-ada saja!',
        '😂 Lumayan untuk hiburan.'
    ],

    interesting: [
        '🤔 Ternyata bisa seperti ini.',
        '👀 Lihat sampai selesai.',
        '😮 Tidak menyangka.',
        '👉🏻 Fakta menarik hari ini.'
    ],

    ocean: [
        '🌊 Laut selalu punya cerita.',
        '🐠 Dunia bawah laut yang indah.',
        '😍 Menenangkan sekali.',
        '🌊 Nikmati suasananya.'
    ],

    city: [
        '🏙️ Kehidupan kota dari sudut berbeda.',
        '🌃 City vibes.',
        '✨ Kota tidak pernah benar-benar tidur.',
        '🚶 Kehidupan sehari-hari yang menarik.'
    ],

    people: [
        '😊 Momen manusia yang sederhana.',
        '✨ Kehidupan sehari-hari.',
        '👀 Ada cerita di balik setiap momen.',
        '❤️ Human moments.'
    ],

    creative: [
        '🎨 Kreativitas tanpa batas.',
        '💡 Ide yang menarik.',
        '✨ Proses kreatif selalu menyenangkan.',
        '🔥 Hasil akhirnya keren.'
    ]

};


// ============================================================
// RANDOM HELPER
// ============================================================

function randomItemData(array) {

    if (!array || array.length === 0) {
        return null;
    }

    return array[
        Math.floor(Math.random() * array.length)
    ];
}


// ============================================================
// PILIH TOPIK TANPA CEPAT BERULANG
// ============================================================

function getRandomFeedTopicsData(count = 5) {

    let availableTopics = feedTopicsData.filter(topic => {

        return !feedRecentTopicsData.includes(topic.category);

    });

    // Jika topik yang tersedia kurang
    if (availableTopics.length < count) {

        feedRecentTopicsData = [];

        availableTopics = [...feedTopicsData];

    }

    // Acak
    availableTopics.sort(() => Math.random() - 0.5);

    const selected = availableTopics.slice(0, count);

    selected.forEach(topic => {

        feedRecentTopicsData.push(topic.category);

    });

    // Simpan hanya beberapa topic terakhir
    if (feedRecentTopicsData.length > 10) {

        feedRecentTopicsData =
            feedRecentTopicsData.slice(-10);

    }

    return selected;

}


// ============================================================
// CACHE
// ============================================================

function getFeedCacheData() {

    try {

        const raw =
            localStorage.getItem(FEED_CACHE_KEY);

        if (!raw) return null;

        const parsed = JSON.parse(raw);

        if (!parsed.timestamp || !parsed.data) {

            localStorage.removeItem(FEED_CACHE_KEY);

            return null;

        }

        const age =
            Date.now() - parsed.timestamp;

        if (age > FEED_CACHE_TIME) {

            localStorage.removeItem(FEED_CACHE_KEY);

            return null;

        }

        return parsed.data;

    } catch (error) {

        console.warn(
            'Gagal membaca cache Short:',
            error
        );

        localStorage.removeItem(FEED_CACHE_KEY);

        return null;

    }

}


function setFeedCacheData(data) {

    try {

        localStorage.setItem(
            FEED_CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                data: data
            })
        );

    } catch (error) {

        console.warn(
            'Gagal menyimpan cache Short:',
            error
        );

    }

}


// ============================================================
// GENERATE DESKRIPSI
// ============================================================
/*
function generateFeedDescriptionData(category) {

    const descriptions =
        feedDescriptionsData[category] ||
        [
            '✨ Video menarik hari ini.',
            '👀 Lihat sampai selesai.',
            '🔥 Menarik untuk ditonton.'
        ];

    return randomItemData(descriptions);

}
*/

function generateFeedDescriptionData(category) {
    // Ambil dari feedDescriptionsData kalau ada
    const descriptions = feedDescriptionsData[category];
    if (descriptions && descriptions.length > 0) {
        return randomItemData(descriptions);
    }
    
    // Fallback generic — kalau kategori tidak ada di feedDescriptionsData
    const fallbacks = {
        'bisnis': ['💼 Insight bisnis hari ini.', '🚀 Peluang usaha menarik.', '📊 Strategi bisnis.'],
        'finansial': ['💰 Tips keuangan hari ini.', '📈 Wawasan investasi.', '🏦 Kelola uang lebih baik.'],
        'humor': ['😂 Bikin ngakak!', '🤣 Lucu banget!', '😆 Hiburan hari ini.'],
        'olahraga': ['⚽ Aksi luar biasa!', '🏀 Skill keren!', '💪 Semangat olahraga!'],
        'seni': ['🎨 Karya seni indah.', '🖌️ Proses kreatif.', '✨ Estetika visual.'],
        'teknologi': ['💻 Inovasi teknologi.', '🤖 Masa depan digital.', '⚡ Tech update!'],
        'alam': ['🌳 Keindahan alam.', '🏔️ Pemandangan memukau.', '🌊 Pesona alam.'],
        'hewan': ['🐱 Gemas banget!', '🐶 Menggemaskan!', '🦁 Dunia satwa.'],
        'kuliner': ['🍜 Menggugah selera!', '🍰 Lezat banget!', '👨‍🍳 Kuliner menarik.'],
        'travel': ['✈️ Explore dunia!', '🌍 Destinasi keren!', '📍 Tempat menarik.'],
        'musik': ['🎵 Vibes hari ini.', '🎸 Musik keren!', '🎶 Nikmati alunan.'],
        'mobil': ['🚗 Mobil keren!', '🏎️ Otomotif menarik.', '⚡ Speed & style.'],
        'edukasi': ['📚 Belajar hal baru.', '🧠 Insight bermanfaat.', '💡 Pengetahuan baru.'],
        'foryou': ['✨ Video untukmu.', '👀 Lihat sampai selesai.', '🔥 Trending!']
    };
    
    const fallbackList = fallbacks[category] || ['✨ Video menarik hari ini.'];
    return randomItemData(fallbackList);
}


// ============================================================
// LOAD FEED VIDEOS
// ============================================================

async function loadFeedVideosData(reset = true) {

    if (feedIsLoadingData) return;

    feedIsLoadingData = true;

    const container =
        document.getElementById('feedContainer');

    if (!container) {

        feedIsLoadingData = false;

        return;

    }


    // ========================================================
    // RESET
    // ========================================================

    if (reset) {

        feedVideosData = [];

        feedCurrentIndexData = 0;

        feedPageData = 1;

        feedHasMoreData = true;

        feedRecentTopicsData = [];

        feedSeenVideoIdsData = new Set();

        container.innerHTML = `
            <div class="feed-loading" id="feedLoading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Menyiapkan Short Video...</span>
            </div>
        `;

    }


    try {

        // ====================================================
        // CACHE HANYA UNTUK LOAD AWAL
        // ====================================================

        if (reset) {

            const cached =
                getFeedCacheData();

            if (
                cached &&
                Array.isArray(cached) &&
                cached.length > 0
            ) {

                console.log(
                    'Short dimuat dari cache'
                );

                feedVideosData = cached;

                cached.forEach(video => {

                    if (video && video.id) {

                        feedSeenVideoIdsData.add(
                            String(video.id)
                        );

                    }

                });

                renderFeedVideosData();

                feedIsLoadingData = false;

                return;

            }

        }


        // ====================================================
        // PILIH BEBERAPA TOPIK
        // ====================================================

        const selectedTopics =
            getRandomFeedTopicsData(
                FEED_TOPIC_COUNT
            );


        console.log(
            'Short topics:',
            selectedTopics.map(
                topic => topic.category
            )
        );


        // ====================================================
        // REQUEST PARALEL
        // ====================================================

        const requests =
            selectedTopics.map(async topic => {

                const query =
                    randomItemData(
                        topic.queries
                    );

                const url =
                    `${PEXELS_VIDEO_BASE}/search?` +
                    `query=${encodeURIComponent(query)}` +
                    `page=1` +
                    `&per_page=8`;

                console.log(
                    `🔎 ${topic.category}: ${query}`
                );


                const response =
                    await fetch(url, {

                        headers: {
                            'Authorization':
                                PEXELS_API_KEY
                        }

                    });


                if (!response.ok) {

                    throw new Error(
                        `Pexels HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                return {
                    topic: topic,
                    data: data
                };

            });


        const results =
            await Promise.allSettled(requests);


        // ====================================================
        // GABUNGKAN HASIL
        // ====================================================

        let collectedVideos = [];


        results.forEach(result => {

            if (result.status !== 'fulfilled') {

                console.warn(
                    'Salah satu topic gagal:',
                    result.reason
                );

                return;

            }


            const topic =
                result.value.topic;

            const data =
                result.value.data;


            const videos =
                data.videos || [];


            videos.forEach(video => {

                if (!video || !video.id) {
                    return;
                }


                const videoId =
                    String(video.id);


                // Hindari video duplikat
                if (
                    feedSeenVideoIdsData.has(
                        videoId
                    )
                ) {

                    return;

                }


                const files =
                    Array.isArray(
                        video.video_files
                    )
                        ? video.video_files
                        : [];


                // Prioritaskan HD
                const videoFile =
                    files.find(
                        file =>
                            file.quality === 'hd'
                    ) ||

                    files.find(
                        file =>
                            file.quality === 'sd'
                    ) ||

                    files[0];


                if (
                    !videoFile ||
                    !videoFile.link
                ) {

                    return;

                }


                const pictures =
                    Array.isArray(
                        video.video_pictures
                    )
                        ? video.video_pictures
                        : [];


                const thumbnail =
                    pictures.find(
                        picture =>
                            picture.width >= 640
                    )?.picture ||

                    pictures[0]?.picture ||

                    video.image ||

                    '';


                const usernames = [
                    'alovera_creator',
                    'daily_creator',
                    'creative_world',
                    'explore_daily',
                    'trend_creator',
                    'visual_daily',
                    'world_creator',
                    'discover_more'
                ];


                const randomUser =
                    randomItemData(
                        usernames
                    );


                const randomNumber =
                    Math.floor(
                        Math.random() * 9999
                    );


                collectedVideos.push({

                    id: video.id,

                    videoUrl:
                        videoFile.link,

                    thumbnail:
                        thumbnail,

                    user:
                        `${randomUser}_${randomNumber}`,

                    duration:
                        video.duration || 0,

                    likes:
                        Math.floor(
                            Math.random() *
                            500000
                        ) + 10000,

                    shares:
                        Math.floor(
                            Math.random() *
                            5000
                        ) + 50,

                    description:
                        generateFeedDescriptionData(
                            topic.category
                        ),

                    category:
                        topic.category,

                    isLiked: false,

                    viewed: false,

                    createdAt:
                        Date.now()

                });


                feedSeenVideoIdsData.add(
                    videoId
                );

            });

        });


        // ====================================================
        // ACAK HASIL
        // ====================================================

        collectedVideos.sort(
            () => Math.random() - 0.5
        );


        // ====================================================
        // JIKA TIDAK ADA HASIL
        // ====================================================

        if (collectedVideos.length === 0) {

            if (reset) {

                container.innerHTML = `
                    <div class="feed-empty">
                        <i class="fas fa-video-slash"></i>
                        <span>
                            Tidak ada video saat ini
                        </span>
                        <button
                            onclick="refreshFeedData()"
                            style="
                                margin-top:12px;
                                padding:8px 20px;
                                border-radius:10px;
                                border:none;
                                cursor:pointer;
                            "
                        >
                            <i class="fas fa-sync-alt"></i>
                            Coba Lagi
                        </button>
                    </div>
                `;

            }

            feedHasMoreData = false;

            feedIsLoadingData = false;

            return;

        }


        // ====================================================
        // MASUKKAN KE FEED
        // ====================================================

        if (reset) {

            feedVideosData =
                collectedVideos.slice(
                    0,
                    FEED_BATCH_SIZE
                );

        } else {

            feedVideosData = [
                ...feedVideosData,
                ...collectedVideos
            ];

        }


        // ====================================================
        // BATASI JUMLAH DATA
        // ====================================================

        if (
            feedVideosData.length > 100
        ) {

            feedVideosData =
                feedVideosData.slice(-100);

        }


        feedPageData++;


        // ====================================================
        // SIMPAN CACHE
        // ====================================================

        if (reset) {

            setFeedCacheData(
                feedVideosData
            );

        }


        renderFeedVideosData();


    } catch (error) {

        console.error(
            ' Gagal memuat feed:',
            error
        );


        if (reset) {

            container.innerHTML = `
                <div class="feed-empty">

                    <i class="fas fa-exclamation-circle"></i>

                    <span>
                        Gagal memuat video
                    </span>

                    <small
                        style="
                            display:block;
                            margin-top:8px;
                            opacity:.6;
                        "
                    >
                        ${error.message || 'Terjadi kesalahan'}
                    </small>

                    <button
                        onclick="refreshFeedData()"
                        style="
                            margin-top:12px;
                            padding:8px 24px;
                            border-radius:10px;
                            border:1px solid rgba(255,255,255,.1);
                            background:rgba(255,255,255,.05);
                            color:#fff;
                            cursor:pointer;
                            font-size:13px;
                        "
                    >
                        <i class="fas fa-sync-alt"></i>
                        Coba Lagi
                    </button>

                </div>
            `;

        }

    }


    feedIsLoadingData = false;

}


// ============================================================
// FORMAT ANGKA
// ============================================================

function formatFeedNumberData(num) {

    if (num >= 1000000) {

        return (
            num / 1000000
        ).toFixed(1) + 'M';

    }


    if (num >= 1000) {

        return (
            num / 1000
        ).toFixed(1) + 'K';

    }


    return String(num);

}


// ============================================================
// RENDER FEED
// ============================================================
/*
function renderFeedVideosData() {

    const container =
        document.getElementById(
            'feedContainer'
        );

    if (!container) return;


    const loading =
        document.getElementById(
            'feedLoading'
        );

    if (loading) {

        loading.remove();

    }


    if (
        feedVideosData.length === 0
    ) {

        container.innerHTML = `
            <div class="feed-empty">
                <i class="fas fa-video-slash"></i>
                <span>Tidak ada video</span>
            </div>
        `;

        return;

    }


    feedVideosData.forEach(
        (video, index) => {

            const existing =
                container.querySelector(
                    `.feed-item[data-index="${index}"]`
                );


            if (existing) {

                return;

            }


            const div =
                document.createElement('div');


            div.className =
                'feed-item';


            div.setAttribute(
                'data-index',
                index
            );


            div.setAttribute(
                'data-video-id',
                video.id
            );


            div.setAttribute(
                'data-category',
                video.category || 'random'
            );


            const initials =
                (video.user || 'creator')
                    .split('_')[0]
                    .substring(0, 2)
                    .toUpperCase();


            div.innerHTML = `

                <video
                    src="${video.videoUrl}"
                    poster="${video.thumbnail}"
                    loop
                    playsinline
                    muted
                    preload="metadata"
                ></video>


                <div class="feed-overlay">

                    <div class="feed-user">

                        <div class="feed-avatar">
                            ${initials}
                        </div>

                        <span class="feed-username">
                            @${video.user}
                        </span>

                        <span class="feed-badge">
                            <i class="fas fa-check-circle"></i>
                            Premium
                        </span>

                    </div>


                    <div class="feed-description">
                        ${video.description}
                    </div>


                    <div
                        class="feed-topic"
                        style="
                            font-size:11px;
                            opacity:.65;
                            margin-top:6px;
                        "
                    >
                        #${video.category || 'discover'}
                    </div>

                </div>


                <div class="feed-actions">

                    <button
                        class="feed-action-btn"
                        onclick="likeFeedVideoData(${index})"
                    >

                        <div
                            class="action-icon ${
                                video.isLiked
                                    ? 'liked'
                                    : ''
                            }"
                        >
                            <i class="fas fa-heart"></i>
                        </div>

                        <span class="action-count">
                            ${formatFeedNumberData(
                                video.likes
                            )}
                        </span>

                    </button>


                    <button
                        class="feed-action-btn"
                        onclick="shareFeedVideoData(${index})"
                    >

                        <div class="action-icon">
                            <i class="fas fa-share"></i>
                        </div>

                        <span class="action-count">
                            ${formatFeedNumberData(
                                video.shares
                            )}
                        </span>

                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );


    setupFeedVideosData();

}
*/
// ============================================================
// RENDER KATEGORI FEED
// ============================================================
function renderFeedCategories() {
    const track = document.getElementById('feedCategoriesTrack');
    if (!track) return;
    
    track.innerHTML = feedCategoriesData.map(cat => `
        <button 
            class="feed-cat-btn ${cat.id === feedCurrentCategoryData ? 'active' : ''}" 
            data-cat-id="${cat.id}"
            onclick="selectFeedCategory('${cat.id}', this)">
            ${cat.label}
        </button>
    `).join('');
}

// ============================================================
// SELECT KATEGORI
// ============================================================
async function selectFeedCategory(catId, btnEl) {
    // Kalau sama dengan yang aktif, skip
    if (catId === feedCurrentCategoryData) return;
    
    // Update state
    feedCurrentCategoryData = catId;
    
    // Update tombol aktif
    document.querySelectorAll('.feed-cat-btn').forEach(b => {
        b.classList.remove('active');
        b.classList.remove('loading');
    });
    if (btnEl) {
        btnEl.classList.add('active');
        btnEl.classList.add('loading');
    }
    
    // Scroll tombol ke tengah (biar kelihatan)
    if (btnEl) {
        btnEl.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest', 
            inline: 'center' 
        });
    }
    
    // Reset feed & load dengan kategori baru
    try {
        await loadFeedVideosByCategory(catId);
    } catch (err) {
        console.error('Gagal load kategori:', err);
    }
    
    // Hapus state loading
    if (btnEl) {
        btnEl.classList.remove('loading');
    }
}

// ============================================================
// LOAD FEED BERDASARKAN KATEGORI
// ============================================================
async function loadFeedVideosByCategory(catId) {
    // Reset semua state
    feedVideosData = [];
    feedCurrentIndexData = 0;
    feedPageData = 1;
    feedHasMoreData = true;
    feedRecentTopicsData = [];
    feedSeenVideoIdsData = new Set();
    
    // Dispose observer lama
    feedObserversData.forEach(observer => {
        try { observer.disconnect(); } catch (_) {}
    });
    feedObserversData = [];
    
    // Tampilkan loading
    const container = document.getElementById('feedContainer');
    if (container) {
        container.innerHTML = `
            <div class="feed-loading" id="feedLoading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Memuat video ${feedCategoriesData.find(c => c.id === catId)?.label || ''}...</span>
            </div>
        `;
        container.scrollTop = 0;
    }
    
    // Cari kategori
    const category = feedCategoriesData.find(c => c.id === catId);
    if (!category) return;
    
    // Kalau "Untuk Kamu" — pakai loadFeedVideosData yang lama (random semua)
    if (catId === 'foryou' || !category.topics) {
        await loadFeedVideosData(true);
        return;
    }
    
    // Kalau kategori spesifik — fetch berdasarkan topics
    feedIsLoadingData = true;
    
    try {
        // Pilih 3-4 topik acak dari category.topics
        const shuffledTopics = [...category.topics].sort(() => Math.random() - 0.5);
        const selectedTopics = shuffledTopics.slice(0, 4);
        
        console.log(`📂 Loading category: ${catId} →`, selectedTopics);
        
        // Request paralel
        const requests = selectedTopics.map(async (topic) => {
            const url = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(topic)}&page=1&per_page=8`;
            const response = await fetch(url, {
                headers: { 'Authorization': PEXELS_API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        });
        
        const results = await Promise.allSettled(requests);
        
        let collectedVideos = [];
        
        results.forEach(result => {
            if (result.status !== 'fulfilled') return;
            const videos = result.value.videos || [];
            
            videos.forEach(video => {
                if (!video || !video.id) return;
                const videoId = String(video.id);
                if (feedSeenVideoIdsData.has(videoId)) return;
                
                const files = Array.isArray(video.video_files) ? video.video_files : [];
                const videoFile = files.find(f => f.quality === 'hd') 
                    || files.find(f => f.quality === 'sd') 
                    || files[0];
                if (!videoFile?.link) return;
                
                const pictures = Array.isArray(video.video_pictures) ? video.video_pictures : [];
                const thumbnail = pictures.find(p => p.width >= 640)?.picture 
                    || pictures[0]?.picture 
                    || video.image 
                    || '';
                
                const usernames = [
                    'alovera_creator', 'daily_creator', 'creative_world', 
                    'explore_daily', 'trend_creator', 'visual_daily'
                ];
                const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
                const randomNumber = Math.floor(Math.random() * 9999);
                
                collectedVideos.push({
                    id: video.id,
                    videoUrl: videoFile.link,
                    thumbnail: thumbnail,
                    user: `${randomUser}_${randomNumber}`,
                    duration: video.duration || 0,
                    likes: Math.floor(Math.random() * 500000) + 10000,
                    shares: Math.floor(Math.random() * 5000) + 50,
                    description: generateFeedDescriptionData(catId) || '✨ Video menarik',
                    category: catId,
                    isLiked: false,
                    viewed: false,
                    createdAt: Date.now()
                });
                
                feedSeenVideoIdsData.add(videoId);
            });
        });
        
        collectedVideos.sort(() => Math.random() - 0.5);
        
        // Kalau kosong — fallback ke random
        if (collectedVideos.length === 0) {
            console.warn('Kategori kosong, fallback ke random');
            await loadFeedVideosData(true);
            return;
        }
        
        feedVideosData = collectedVideos.slice(0, FEED_BATCH_SIZE);
        renderFeedVideosData();
        
    } catch (err) {
        console.error('Error loading category:', err);
        const container = document.getElementById('feedContainer');
        if (container) {
            container.innerHTML = `
                <div class="feed-empty">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Gagal memuat video kategori ini</span>
                    <button onclick="selectFeedCategory('${catId}')" 
                            style="margin-top:12px;padding:8px 20px;border-radius:10px;border:none;cursor:pointer;">
                        Coba Lagi
                    </button>
                </div>
            `;
        }
    }
    
    feedIsLoadingData = false;
}



// ============================================================
// RENDER FEED VIDEOS - DENGAN TOMBOL DOWNLOAD
// ============================================================
function renderFeedVideosData() {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    
    const loading = document.getElementById('feedLoading');
    if (loading) loading.remove();
    
    if (feedVideosData.length === 0) {
        container.innerHTML = `
            <div class="feed-empty">
                <i class="fas fa-video-slash"></i>
                <span>Tidak ada video</span>
            </div>
        `;
        return;
    }
    
    feedVideosData.forEach((video, index) => {
        const existing = container.querySelector(`.feed-item[data-index="${index}"]`);
        if (existing) return;
        
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.setAttribute('data-index', index);
        
        function formatNumber(num) {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toString();
        }
        
        const initials = video.user.split('_')[0].substring(0, 2).toUpperCase();
        
        const hashtagHTML = video.hashtags && video.hashtags.length > 0 
            ? video.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')
            : '';
        
        
        /*
        div.innerHTML = `
            <video src="${video.videoUrl}" poster="${video.thumbnail}" loop playsinline muted></video>
            <div class="feed-overlay">
                <div class="feed-user">
                    <div class="feed-avatar">${initials}</div>
                    <span class="feed-username">@${video.user}</span>
                    <span class="feed-badge"><i class="fas fa-check-circle"></i> Premium</span>
                </div>
                <div class="feed-description">${video.description}</div>
                ${hashtagHTML ? `<div class="feed-hashtags">${hashtagHTML}</div>` : ''}
            </div>
            <div class="feed-actions">
                <button class="feed-action-btn" onclick="likeFeedVideoData(${index})">
                    <div class="action-icon ${video.isLiked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i>
                    </div>
                    <span class="action-count">${formatNumber(video.likes)}</span>
                </button>
                <button class="feed-action-btn" onclick="downloadFeedVideoData(${index})">
                    <div class="action-icon download">
                        <i class="fas fa-download"></i>
                    </div>
                    <span class="action-count">${formatNumber(video.shares)}</span>
                </button>
            </div>
        `;
        */
// Deteksi apakah ini user post atau Pexels
const isUserPost = video.isUserPost || false;

// Untuk user post, JANGAN pakai poster (karena poster harus gambar, bukan video)
// Pakai background gradient sebagai placeholder, atau tanpa poster
const posterAttr = isUserPost 
    ? '' 
    : `poster="${video.thumbnail}"`;

div.innerHTML = `
    <video 
        src="${video.videoUrl}" 
        ${posterAttr}
        loop 
        playsinline 
        webkit-playsinline
        muted
        preload="metadata"
        crossorigin="anonymous"></video>
    <div class="feed-overlay">
        <div class="feed-user">
            <div class="feed-avatar">${initials}</div>
            <span class="feed-username">@${video.user}</span>
            <span class="feed-badge"><i class="fas fa-check-circle"></i> ${isUserPost ? 'Community' : 'Premium'}</span>
        </div>
        <div class="feed-description">${video.description}</div>
        ${hashtagHTML ? `<div class="feed-hashtags">${hashtagHTML}</div>` : ''}
    </div>
    
    <!--
    <div class="feed-actions">
        <button class="feed-action-btn" onclick="likeFeedVideoData(${index})">
            <div class="action-icon ${video.isLiked ? 'liked' : ''}">
                <i class="fas fa-heart"></i>
            </div>
            <span class="action-count">${formatNumber(video.likes)}</span>
        </button>
        <button class="feed-action-btn" onclick="downloadFeedVideoData(${index})">
            <div class="action-icon download">
                <i class="fas fa-download"></i>
            </div>
            <span class="action-count">${formatNumber(video.shares)}</span>
        </button>
    </div>
    -->
<div class="feed-actions">
    <button class="feed-action-btn" onclick="likeFeedVideoData(${index})">
        <div class="action-icon ${video.isLiked ? 'liked' : ''}">
            <i class="fas fa-heart"></i>
        </div>
        <span class="action-count">${formatNumber(video.likes)}</span>
    </button>
    <button class="feed-action-btn" onclick="downloadFeedVideoData(${index})">
        <div class="action-icon download">
            <i class="fas fa-download"></i>
        </div>
        <span class="action-count">${formatNumber(video.shares)}</span>
    </button>
    <button class="feed-action-btn" onclick="refreshFeedVideos(event)" title="Muat ulang video baru">
        <div class="action-icon refresh" id="feedRefreshBtn">
            <i class="fas fa-rotate-right"></i>
        </div>
        <span class="action-count">Muat</span>
    </button>
</div>

    
`;


        
        
        
        container.appendChild(div);
    });
    
    setupFeedVideosData();
}

// ============================================================
// DOWNLOAD FEED VIDEO (SEPERTI DI STOCK)
// ============================================================
async function downloadFeedVideoData(index) {
    if (index < 0 || index >= feedVideosData.length) return;
    
    const video = feedVideosData[index];
    const url = video.videoUrl;
    
    if (!url) {
        showNotification('Link video tidak tersedia');
        return;
    }
    
    // Cari tombol download yang diklik
    const container = document.getElementById('feedContainer');
    const item = container.querySelector(`.feed-item[data-index="${index}"]`);
    const downloadBtn = item?.querySelector('.feed-action-btn:last-child .action-icon');
    
    if (downloadBtn) {
        downloadBtn.classList.add('loading');
        downloadBtn.innerHTML = '<span class="spinner-download"></span>';
    }
    
    try {
        showNotification('Menyiapkan unduhan...');
        
        const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
        if (!response.ok) throw new Error('Gagal mengunduh');
        
        const blob = await response.blob();
        if (blob.size === 0) throw new Error('File kosong');
        
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `alovera-feed-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        
        showNotification('Video berhasil diunduh!');
        
        // Update share count (sebagai download count)
        video.shares += 1;
        const countEl = item?.querySelector('.feed-action-btn:last-child .action-count');
        if (countEl) {
            const num = video.shares;
            countEl.textContent = num >= 1000 ? (num/1000).toFixed(1) + 'K' : num.toString();
        }
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Gagal mengunduh. Coba klik kanan video dan pilih "Cari Video...."');
    }
    
    if (downloadBtn) {
        downloadBtn.classList.remove('loading');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    }
}






// ============================================================
// AUTOPLAY + OBSERVER
// ============================================================

function setupFeedVideosData() {

    const container =
        document.getElementById(
            'feedContainer'
        );

    if (!container) return;


    // Hapus observer lama
    feedObserversData.forEach(
        observer => {

            try {
                observer.disconnect();
            } catch (_) {}

        }
    );


    feedObserversData = [];


    const videos =
        container.querySelectorAll(
            '.feed-item video'
        );


    videos.forEach(video => {

        video.volume = 1.0;


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio >= 0.65
                        ) {

                            // Pause semua video lain
                            videos.forEach(
                                otherVideo => {

                                    if (
                                        otherVideo !== video
                                    ) {

                                        otherVideo.pause();

                                    }

                                }
                            );


                            // Autoplay
                            video.muted = true;

/*
                            video.play()
                                .then(() => {

                                    // Tandai sudah ditonton
                                    const item =
                                        video.closest(
                                            '.feed-item'
                                        );

                                    if (item) {

                                        const index =
                                            Number(
                                                item.dataset.index
                                            );

                                        if (
                                            feedVideosData[index]
                                        ) {

                                            feedVideosData[index]
                                                .viewed = true;

                                        }

                                    }

                                })
                                .catch(() => {

                                    // Browser dapat menolak autoplay.
                                    // Kita tetap membiarkan video
                                    // menunggu interaksi pengguna.

                                });
                                
                                */
                                
video.play()
    .then(() => {
        // Tandai sudah ditonton
        const item = video.closest('.feed-item');
        if (item) {
            const index = Number(item.dataset.index);
            if (feedVideosData[index]) {
                feedVideosData[index].viewed = true;
            }
        }
    })
    .catch((err) => {
        console.warn('⚠️ Autoplay gagal:', err.message, '| Src:', video.src);
        
        // Fallback: coba play setelah user klik pertama
        if (!video._autoplayRetry) {
            video._autoplayRetry = true;
            const retryPlay = () => {
                video.play().catch(() => {});
                document.removeEventListener('touchstart', retryPlay);
                document.removeEventListener('click', retryPlay);
            };
            document.addEventListener('touchstart', retryPlay, { once: true, passive: true });
            document.addEventListener('click', retryPlay, { once: true });
        }
    });
    
    
                        } else {

                            video.pause();

                        }

                    });

                },
                {
                    threshold: [
                        0.25,
                        0.65,
                        0.9
                    ]
                }
            );


        observer.observe(video);

        feedObserversData.push(
            observer
        );


        // Tap video untuk play/pause
        video.addEventListener(
            'click',
            function () {

                if (video.paused) {

                    // Pause video lain
                    videos.forEach(
                        other => {

                            if (other !== video) {
                                other.pause();
                            }

                        }
                    );

                    video.play().catch(() => {});

                } else {

                    video.pause();

                }

            }
        );

    });


    // ========================================================
    // AUTOPLAY VIDEO PERTAMA
    // ========================================================

    setTimeout(() => {

        const firstVideo =
            container.querySelector(
                '.feed-item video'
            );


        if (!firstVideo) return;


        firstVideo.muted = true;


        firstVideo.play()
            .catch(() => {

                // Browser membutuhkan interaksi user.
                console.log(
                    'ℹ️ Autoplay menunggu interaksi pengguna'
                );

            });


    }, 300);

}


// ============================================================
// LIKE
// ============================================================

function likeFeedVideoData(index) {

    if (
        index < 0 ||
        index >= feedVideosData.length
    ) {

        return;

    }


    const video =
        feedVideosData[index];


    video.isLiked =
        !video.isLiked;


    video.likes +=
        video.isLiked
            ? 1
            : -1;


    const container =
        document.getElementById(
            'feedContainer'
        );


    if (!container) return;


    const item =
        container.querySelector(
            `.feed-item[data-index="${index}"]`
        );


    if (!item) return;


    const heartIcon =
        item.querySelector(
            '.action-icon'
        );


    const countEl =
        item.querySelector(
            '.feed-action-btn .action-count'
        );


    if (heartIcon) {

        heartIcon.classList.toggle(
            'liked',
            video.isLiked
        );

    }


    if (countEl) {

        countEl.textContent =
            formatFeedNumberData(
                video.likes
            );

    }

}


// ============================================================
// SHARE
// ============================================================

function shareFeedVideoData(index) {

    if (
        index < 0 ||
        index >= feedVideosData.length
    ) {

        return;

    }


    const video =
        feedVideosData[index];


    const url =
        video.videoUrl ||
        window.location.href;


    if (
        navigator.share
    ) {

        navigator.share({

            title:
                'Video menarik dari Alovera',

            text:
                'Tonton video ini di Alovera!',

            url:
                url

        }).catch(() => {});


    } else if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(url)
            .then(() => {

                if (
                    typeof showNotification ===
                    'function'
                ) {

                    showNotification(
                        '📋 Link disalin!'
                    );

                }

            })
            .catch(() => {

                if (
                    typeof showNotification ===
                    'function'
                ) {

                    showNotification(
                        '🔗 ' + url
                    );

                }

            });

    }

}


// ============================================================
// REFRESH FEED
// ============================================================

function refreshFeedData() {

    // Hapus cache versi lama
    localStorage.removeItem(
        FEED_CACHE_KEY
    );


    // Hapus cache lama dari kode sebelumnya
    localStorage.removeItem(
        'feed_videos_data'
    );

    localStorage.removeItem(
        'saham_feed_videos_data'
    );


    feedVideosData = [];

    feedCurrentIndexData = 0;

    feedPageData = 1;

    feedHasMoreData = true;

    feedRecentTopicsData = [];

    feedSeenVideoIdsData =
        new Set();


    const container =
        document.getElementById(
            'feedContainer'
        );


    if (container) {

        container.innerHTML = `
            <div
                class="feed-loading"
                id="feedLoading"
            >
                <i class="fas fa-spinner fa-spin"></i>
                <span>
                    Mencari video baru...
                </span>
            </div>
        `;

    }


    loadFeedVideosData(true);

}


// ============================================================
// REFRESH FEED - DARI TOMBOL
// ============================================================
async function refreshFeedVideos(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Cek apakah sedang loading
    if (feedIsLoadingData) {
        showNotification('Sedang memuat, mohon tunggu...', 'warning');
        return;
    }
    
    // Animasi spinner di tombol
    const btn = document.getElementById('feedRefreshBtn');
    if (btn) {
        btn.classList.add('spinning');
    }
    
    showNotification('Memuat video baru...', 'info');
    
    try {
        // 1. Clear cache
        localStorage.removeItem(FEED_CACHE_KEY);
        localStorage.removeItem('feed_videos_data');
        localStorage.removeItem('saham_feed_videos_data');
        
        // 2. Reset semua state
        feedVideosData = [];
        feedCurrentIndexData = 0;
        feedPageData = 1;
        feedHasMoreData = true;
        feedRecentTopicsData = [];
        feedSeenVideoIdsData = new Set();
        
        // 3. Hapus observer lama biar tidak memory leak
        feedObserversData.forEach(observer => {
            try { observer.disconnect(); } catch (_) {}
        });
        feedObserversData = [];
        
        // 4. Tampilkan loading di container
        const container = document.getElementById('feedContainer');
        if (container) {
            container.innerHTML = `
                <div class="feed-loading" id="feedLoading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Mencari video baru...</span>
                </div>
            `;
            container.scrollTop = 0;
        }
        
        // 5. Load data baru (force fresh, skip cache)
        await loadFeedVideosData(true);
        
        // 6. Kalau ada user posts, tambahkan lagi ke feed
        if (typeof currentUser !== 'undefined' && currentUser) {
            try {
                const userPostsData = await loadUserPostsForFeed();
                const videoPosts = userPostsData.filter(post => 
                    post.media_type === 'video' || 
                    (post.media_url && /\.(mp4|webm|mov|m4v)$/i.test(post.media_url))
                );
                
                if (videoPosts.length > 0) {
                    const userVideos = videoPosts.map(post => ({
                        id: 'user-' + post.id,
                        videoUrl: post.media_url,
                        thumbnail: null,
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
                    
                    feedVideosData = [...userVideos, ...feedVideosData];
                    renderFeedVideosData();
                }
            } catch (err) {
                console.warn('Gagal menambahkan user posts:', err);
            }
        }
        
        // 7. Notifikasi selesai
        setTimeout(() => {
            showNotification('Video baru berhasil dimuat', 'success');
        }, 500);
        
    } catch (error) {
        console.error('Refresh feed error:', error);
        showNotification('Gagal memuat ulang: ' + (error.message || 'Error'), 'error');
    } finally {
        // Hapus animasi spinner setelah selesai
        setTimeout(() => {
            if (btn) btn.classList.remove('spinning');
        }, 800);
    }
}




// ============================================================
// LOAD MORE
// ============================================================

async function loadMoreFeedData() {

    if (
        feedIsLoadingData ||
        !feedHasMoreData
    ) {

        return;

    }


    // Untuk batch berikutnya,
    // ambil kembali beberapa topic baru.
    await loadFeedVideosData(false);

}


// ============================================================
// INFINITE SCROLL
// ============================================================

function setupFeedInfiniteScrollData() {

    const container =
        document.getElementById(
            'feedContainer'
        );


    if (!container) return;


    // Hindari event listener ganda
    if (
        container.dataset.feedScrollReady ===
        'true'
    ) {

        return;

    }


    container.dataset.feedScrollReady =
        'true';


    container.addEventListener(
        'scroll',
        function () {

            const scrollTop =
                this.scrollTop;


            const scrollHeight =
                this.scrollHeight;


            const clientHeight =
                this.clientHeight;


            // Mulai mengambil data
            // sebelum user mencapai akhir
            if (
                scrollTop +
                clientHeight >=
                scrollHeight * 0.70
            ) {

                loadMoreFeedData();

            }

        },
        {
            passive: true
        }
    );

}


// ============================================================
// INIT FEED
// ============================================================
/*
function initFeedData() {

    if (feedInitializedData) {

        return;

    }


    feedInitializedData = true;


    setupFeedInfiniteScrollData();


    loadFeedVideosData(true);

}
*/
function initFeedData() {
    if (feedInitializedData) {
        return;
    }
    feedInitializedData = true;
    setupFeedInfiniteScrollData();
    renderFeedCategories(); // ← tambahkan ini
    loadFeedVideosData(true);
}


// ============================================================
// NAVIGATION FEED
// ============================================================

const originalNavFeedData =
    window.navigateTo;


window.navigateTo =
    function(page) {

        if (
            typeof originalNavFeedData ===
            'function'
        ) {

            originalNavFeedData(page);

        }


        if (
            page === 'feed'
        ) {

            setTimeout(
                () => {

                    const container =
                        document.getElementById(
                            'feedContainer'
                        );


                    if (
                        container &&
                        !feedInitializedData
                    ) {

                        initFeedData();

                    }


                    // Jika feed sudah pernah
                    // dibuat, pastikan video
                    // yang terlihat dimainkan.

                    if (
                        container &&
                        feedInitializedData
                    ) {

                        setupFeedVideosData();

                    }

                },
                300
            );

        }

    };


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        const feedPage =
            document.getElementById(
                'feedPage'
            );


        if (
            feedPage &&
            feedPage.classList.contains(
                'active'
            )
        ) {

            setTimeout(
                initFeedData,
                500
            );

        }

    }
);


// ============================================================
// DEBUG
// ============================================================

console.log(
    '🎬 Alovera Random Discovery Short loaded!'
);

console.log(
    `📚 ${feedTopicsData.length} kategori tersedia`
);







// ============================================================
// EKSPOS FUNGSI KATEGORI KE WINDOW
// ============================================================
window.selectFeedCategory = selectFeedCategory;
window.loadFeedVideosByCategory = loadFeedVideosByCategory;
window.renderFeedCategories = renderFeedCategories;
window.feedCurrentCategoryData = feedCurrentCategoryData;