let watchId = null;
let map, marker;

// Inisialisasi Peta Leaflet
function initMap() {
    // Set tampilan awal ke koordinat 0,0 (tengah dunia)
    map = L.map('map').setView([0, 0], 2);
    
    // Gunakan provider peta OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Siapkan marker kosong
    marker = L.marker([0, 0]).addTo(map);
}

async function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (res.ok) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('tracking-section').style.display = 'block';
        initMap(); // Panggil peta setelah login berhasil
    } else {
        alert("Login Gagal!");
    }
}

function toggleTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        document.getElementById('btn-track').innerText = "Aktifkan Lokasi";
    } else {
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(sendLocation, handleError, {
                enableHighAccuracy: true
            });
            document.getElementById('btn-track').innerText = "Matikan Lokasi";
        }
    }
}

async function sendLocation(position) {
    const { latitude, longitude } = position.coords;
    
    // 1. Update Tampilan Peta
    const newPos = [latitude, longitude];
    marker.setLatLng(newPos);
    map.setView(newPos, 15); // Zoom ke lokasi user
    
    document.getElementById('status').innerText = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;

    // 2. Kirim ke Backend (Tetap sama seperti sebelumnya)
    await fetch('/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: latitude, lng: longitude })
    });
}

function handleError(err) {
    const status = document.getElementById('status');
    if (err.code === 1) status.innerText = "Akses lokasi ditolak pengguna.";
    else status.innerText = "Gagal mendapatkan lokasi.";
}
