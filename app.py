from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Request
)

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from utils.model_loader import load_model
from utils.image_processor import preprocess_image
from utils.predictor import predict_image


BASE_DIR = Path(__file__).resolve().parent

MAX_FILE_SIZE = 10 * 1024 * 1024


# Load model when application starts
@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.model = load_model()

    yield

    app.state.model = None


app = FastAPI(
    title="Cats vs Dogs Classifier API",
    description="CNN-based image classification API",
    version="1.0.0",
    lifespan=lifespan
)


# Static files
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)


# HTML templates
templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)


# Home route
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


# Health check
@app.get("/api/health")
def health_check(request: Request):

    return {
        "status": "online",
        "model_loaded": request.app.state.model is not None
    }


# Prediction API
@app.post("/api/predict")
def predict(
    request: Request,
    file: UploadFile = File(...)
):

    try:

        # Read uploaded file
        image_bytes = file.file.read(MAX_FILE_SIZE + 1)

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="No image uploaded."
            )

        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="Image size must be less than 10 MB."
            )

        # Preprocess image
        processed_image = preprocess_image(image_bytes)

        # Get loaded model
        model = request.app.state.model

        # Prediction
        result = predict_image(
            model,
            processed_image
        )

        return result

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except HTTPException:
        raise

    except Exception as error:

        print("Prediction error:", error)

        raise HTTPException(
            status_code=500,
            detail="Something went wrong during prediction."
        )


if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )