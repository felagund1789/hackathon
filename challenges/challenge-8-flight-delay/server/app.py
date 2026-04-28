# Flight Delay Prediction API
#
# This server will expose two endpoints:
# 1. GET /predict   — accepts "day_of_week" and "airport_id" query parameters,
#                     loads the trained model, and returns the probability of a
#                     flight being delayed by more than 15 minutes.
# 2. GET /airports  — returns the list of airports (id + name) from airports.csv,
#                     sorted alphabetically by name.
#
# TODO: Implement the server using Flask, FastAPI, or a framework of your choice.
# TODO: Load the model from model.pkl (created in the notebook step).
# TODO: Load the airports from airports.csv (created in the notebook step).
# TODO: Handle CORS so the frontend can call this API.
