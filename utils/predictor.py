def predict_image(model, processed_image):

    # Model prediction
    prediction = model.predict(
        processed_image,
        verbose=0
    )

    # Extract sigmoid probability
    dog_probability = float(prediction[0][0])

    # Calculate cat probability
    cat_probability = 1.0 - dog_probability

    # Determine predicted class
    if dog_probability >= 0.5:

        predicted_class = "Dog"
        confidence = dog_probability

    else:

        predicted_class = "Cat"
        confidence = cat_probability

    return {

        "predicted_class": predicted_class,

        "confidence": round(confidence * 100, 2),

        "probabilities": {

            "Cat": round(cat_probability * 100, 2),

            "Dog": round(dog_probability * 100, 2)

        }

    }