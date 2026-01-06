// ================== CONFIG ==================
const API_BASE_URL = "https://xxxx.execute-api.region.amazonaws.com/prod";
const UPLOAD_API   = `${API_BASE_URL}/upload`;
const DOWNLOAD_API = `${API_BASE_URL}/download`;
const DELETE_API   = `${API_BASE_URL}/delete`;

// ================== AUTH CHECK ==================
const token = localStorage.getItem("idToken");

if (!token) {
    alert("Unauthorized! Please login first.");
    window.location.href = "login.html";
}

// ================== UPLOAD ==================
async function uploadFile() {
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        try {
            const response = await fetch(UPLOAD_API, {
                method: "POST",
                headers: {
                    // ✅ Bearer added
                    "Authorization": "Bearer " + token
                    // ❌ Content-Type removed (important)
                },
                body: file
            });

            const data = await response.json();
            alert(data.message || "Upload successful");
        } catch (error) {
            alert("Upload failed");
            console.error(error);
        }
    };

    input.click();
}

// ================== DOWNLOAD ==================
async function downloadFile() {
    const fileName = prompt("Enter file name to download:");
    if (!fileName) return;

    try {
        const response = await fetch(`${DOWNLOAD_API}?file=${fileName}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
    } catch (error) {
        alert("Download failed");
    }
}

// ================== DELETE ==================
async function deleteFile() {
    const fileName = prompt("Enter file name to delete:");
    if (!fileName) return;

    try {
        const response = await fetch(`${DELETE_API}?file=${fileName}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();
        alert(data.message || "File deleted");
    } catch (error) {
        alert("Delete failed");
    }
}

// ================== LOGOUT ==================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
