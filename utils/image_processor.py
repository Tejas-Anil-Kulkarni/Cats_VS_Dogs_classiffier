from PIL import Image, UnidentifiedImageError
from io import BytesIO
import numpy as np


IMAGE_SIZE = (150, 150)


def preprocess_image(image_bytes):

    try:

        # Convert uploaded bytes into an image
        image = Image.open(BytesIO(image_bytes))

        # Convert image to RGB
        image = image.convert("RGB")

        # Resize image
        image = image.resize(
            IMAGE_SIZE,
            Image.Resampling.LANCZOS
        )

        # Convert image into NumPy array
        image_array = np.array(image)

        # Normalize pixel values
        image_array = image_array / 255.0

        # Add batch dimension
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        return image_array

    except (UnidentifiedImageError, OSError, ValueError) as error:

        raise ValueError(
            f"Invalid image: {error}"
        )