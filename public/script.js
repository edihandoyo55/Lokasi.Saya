let watchId = null;

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
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            });
            document.getElementById('btn-track').innerText = "Matikan Lokasi";
        } else {
            alert("Browser tidak mendukung Geolocation");
        }
    }
}

async function sendLocation(position) {
    const { latitude, longitude } = position.coords;
    document.getElementById('status').innerText = `Lat: ${latitude}, Lng: ${longitude}`;

    // Kirim ke Backend
    await fetch('/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: latitude, lng: longitude })
    });
}

function handleError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
