function getLocationAndReport() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            reportItem(position.coords.latitude, position.coords.longitude);
        }, () => {
            alert("Could not get location.");
        });
    } else {
        alert("Geolocation not supported.");
    }
}

function reportItem(lat, lon) {
    const type = document.getElementById("reportType").value;
    const description = document.getElementById("reportDesc").value;

    fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, latitude: lat, longitude: lon })
    })
    .then(res => res.json())
    .then(data => {
        alert("Item reported successfully!");
        console.log(data);
    });
}

function searchItems() {
    const type = document.getElementById("searchType").value;
    fetch(`/api/items${type ? "?type=" + type : ""}`)
        .then(res => res.json())
        .then(items => {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";
            items.forEach(item => {
                resultsDiv.innerHTML += `
                    <div class="item-card">
                        <p><b>${item.type.toUpperCase()}</b>: ${item.description}</p>
                        <p>📍 Lat: ${item.latitude}, Lon: ${item.longitude}</p>
                        <iframe
                            width="100%"
                            height="200"
                            src="https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=15&output=embed">
                        </iframe>
                    </div>
                `;
            });
        });
}
