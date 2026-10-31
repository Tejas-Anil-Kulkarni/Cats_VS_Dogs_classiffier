const fileInput = document.getElementById("fileInput");

const browseButton = document.getElementById("browseButton");

const dropZone = document.getElementById("dropZone");

const uploadPlaceholder = document.getElementById("uploadPlaceholder");

const previewContainer = document.getElementById("previewContainer");

const imagePreview = document.getElementById("imagePreview");

const fileName = document.getElementById("fileName");

const removeButton = document.getElementById("removeButton");

const uploadForm = document.getElementById("uploadForm");

const predictButton = document.getElementById("predictButton");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");

const resultCard = document.getElementById("resultCard");

const resetButton = document.getElementById("resetButton");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

let selectedFile = null;
let previewURL = null;


// API health check

async function checkAPI() {

    const statusText = document.getElementById("apiStatus");

    const statusDot = document.querySelector(".status-dot");

    try {

        const response = await fetch("/api/health");

        const data = await response.json();

        if (response.ok && data.model_loaded) {

            statusText.textContent = "Model online";

            statusDot.classList.add("online");
            statusDot.classList.remove("offline");

        } else {

            statusText.textContent = "Model unavailable";

            statusDot.classList.add("offline");
        }

    } catch (error) {

        statusText.textContent = "API offline";

        statusDot.classList.add("offline");
    }
}

checkAPI();


// File validation

function validateFile(file) {

    if (!file) {
        return false;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        showError("Please upload a JPG, PNG or WEBP image.");

        return false;
    }

    if (file.size > MAX_FILE_SIZE) {

        showError("Image must be smaller than 10 MB.");

        return false;
    }

    return true;
}


// Show error

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");
}


// Clear error

function clearError() {

    errorMessage.textContent = "";

    errorMessage.classList.add("hidden");
}


// Select file

function handleFile(file) {

    clearError();

    if (!validateFile(file)) {
        return;
    }

    selectedFile = file;

    if (previewURL) {
        URL.revokeObjectURL(previewURL);
    }

    previewURL = URL.createObjectURL(file);

    imagePreview.src = previewURL;

    fileName.textContent = file.name;

    uploadPlaceholder.classList.add("hidden");

    previewContainer.classList.remove("hidden");

    predictButton.disabled = false;

    resultCard.classList.add("hidden");
}


// Browse button

browseButton.addEventListener("click", () => {

    fileInput.click();

});


// File input

fileInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (file) {
        handleFile(file);
    }

});


// Drag events

dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("dragover");

});


dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragover");

});


dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file) {
        handleFile(file);
    }

});


// Remove image

removeButton.addEventListener("click", resetInterface);


// Reset interface

function resetInterface() {

    selectedFile = null;

    if (previewURL) {

        URL.revokeObjectURL(previewURL);

        previewURL = null;
    }

    fileInput.value = "";

    imagePreview.removeAttribute("src");

    previewContainer.classList.add("hidden");

    uploadPlaceholder.classList.remove("hidden");

    predictButton.disabled = true;

    resultCard.classList.add("hidden");

    loading.classList.add("hidden");

    clearError();
}

resetButton.addEventListener("click", resetInterface);


// Display prediction

function displayResult(data) {

    const label = data.predicted_class;

    const confidence = data.confidence;

    const catProbability = data.probabilities.Cat;

    const dogProbability = data.probabilities.Dog;


    document.getElementById("predictionLabel").textContent = label;

    document.getElementById("confidenceValue").textContent =
        confidence.toFixed(2) + "%";


    document.getElementById("predictionEmoji").textContent =
        label === "Cat" ? "🐱" : "🐶";


    document.getElementById("catProbability").textContent =
        catProbability.toFixed(2) + "%";


    document.getElementById("dogProbability").textContent =
        dogProbability.toFixed(2) + "%";


    document.getElementById("catBar").style.width =
        catProbability + "%";


    document.getElementById("dogBar").style.width =
        dogProbability + "%";


    resultCard.classList.toggle("cat", label === "Cat");

    resultCard.classList.remove("hidden");
}


// Submit image to FastAPI

uploadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!selectedFile) {
        showError("Please select an image first.");
        return;
    }

    clearError();

    resultCard.classList.add("hidden");

    loading.classList.remove("hidden");

    predictButton.disabled = true;

    document.getElementById("buttonText").textContent =
        "Analysing...";


    try {

        const formData = new FormData();

        formData.append("file", selectedFile);


        const response = await fetch("/api/predict", {

            method: "POST",

            body: formData

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail || "Prediction failed."
            );

        }


        displayResult(data);


    } catch (error) {

        showError(error.message);

    } finally {

        loading.classList.add("hidden");

        predictButton.disabled = !selectedFile;

        document.getElementById("buttonText").textContent =
            "Analyse image";

    }

});