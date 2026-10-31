# 🐱 Cats vs Dogs Image Classifier

A deep learning-based image classification web application that identifies whether an uploaded image contains a **Cat or a Dog** using a Convolutional Neural Network (CNN).

The model is trained using the Kaggle Cats vs Dogs dataset and deployed through a FastAPI backend with a simple web-based interface.

## 🚀 Features

- **CNN-based Classification:** Uses a custom-built Convolutional Neural Network.
- **Image Upload:** Upload images directly through the web interface.
- **Real-time Prediction:** Classifies uploaded images as Cat or Dog.
- **Prediction Scores:** Displays the predicted class along with its score.
- **FastAPI Backend:** Provides a REST API for image prediction.
- **Responsive Frontend:** Simple interface built using HTML, CSS, and JavaScript.
- **Model Persistence:** Loads the trained model from a `.keras` file.

## 🧠 Model Architecture

The project uses a custom CNN architecture consisting of:

- Four convolutional blocks.
- Batch Normalization.
- ReLU activation functions.
- Max Pooling layers.
- Dropout for regularization.
- Fully Connected Dense Layer with 512 neurons.
- Sigmoid output layer for binary classification.

### Model Configuration

| Parameter | Value |
|---|---|
| Model Type | Convolutional Neural Network |
| Input Image Size | 150 × 150 |
| Color Channels | RGB (3) |
| Output Classes | Cat, Dog |
| Batch Size | 32 |
| Optimizer | As configured during training |
| Loss Function | Binary Crossentropy |
| Output Activation | Sigmoid |

## 📊 Model Performance

The trained model achieved the following results:

| Metric | Score |
|---|---:|
| Training Accuracy | 93.65% |
| Validation Accuracy | 94.54% |
| Training Loss | 0.1620 |
| Validation Loss | 0.1474 |

*Note: These are the results from the training and validation datasets. Performance on unseen real-world images may differ.*

## 🛠️ Technologies Used

- **Python** – Core programming language
- **TensorFlow / Keras** – Deep learning and model training
- **NumPy** – Numerical operations
- **Pillow (PIL)** – Image processing
- **FastAPI** – Backend API development
- **Uvicorn** – ASGI server
- **HTML** – Webpage structure
- **CSS** – Frontend styling
- **JavaScript** – Frontend interactions
- **Git & GitHub** – Version control

## 📁 Project Structure

```text
Cats_VS_Dogs_Classifier/
│
├── app.py
│
├── models/
│   └── cats_dogs_cnn.keras
│
├── utils/
│   ├── model_loader.py
│   ├── image_processor.py
│   └── predictor.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
├── .gitignore
├── requirements.txt
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tejas-Anil-Kulkarni/Cats_VS_Dogs_classiffier.git
```

### 2. Navigate to the Project Directory

```bash
cd Cats_VS_Dogs_classiffier
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

### 4. Activate the Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Add the Trained Model

Place the trained model file inside the `models` directory:

```text
models/cats_dogs_cnn.keras
```

**Important:** The trained model file is not included in the GitHub repository because it exceeds GitHub's standard 100 MB file limit. You must download or obtain the model separately and place it in the correct directory.

### 7. Run the Application

```bash
python app.py
```

The application will start at:

```text
http://127.0.0.1:8000
```

## 🔌 API Endpoints

### 1. Home Page

```http
GET /
```

Returns the web application interface.

### 2. Health Check

```http
GET /api/health
```

Checks whether the application is running and the model is loaded.

Example response:

```json
{
    "status": "online",
    "model_loaded": true
}
```

### 3. Image Prediction

```http
POST /api/predict
```

Accepts an image file and returns the predicted class and prediction scores.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Parameter: `file`

The API accepts image files up to 10 MB.

## 🔄 Prediction Workflow

1. User uploads an image through the frontend.
2. JavaScript sends the image to the FastAPI backend.
3. The backend validates the uploaded file.
4. Pillow processes the image:
   - Converts it to RGB.
   - Resizes it to 150 × 150 pixels.
   - Normalizes pixel values between 0 and 1.
5. The processed image is passed to the trained CNN model.
6. The model generates a prediction score.
7. The backend returns the predicted class and scores.
8. The frontend displays the result.

## 🔮 Future Improvements

- Improve model generalization using additional training data.
- Experiment with Transfer Learning architectures such as MobileNetV2 and EfficientNet.
- Add Grad-CAM visualization to explain model predictions.
- Deploy the application to a cloud platform.
- Add support for multiple image formats and batch predictions.

## 👨‍💻 Author

**Tejas Anil Kulkarni**

- GitHub: [Tejas-Anil-Kulkarni](https://github.com/Tejas-Anil-Kulkarni)

## 📜 License

This project is intended for educational and learning purposes.
