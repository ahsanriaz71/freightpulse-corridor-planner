from datetime import timedelta
from datetime import timezone as dt_timezone

from django.utils import timezone
from rest_framework import serializers

from ...domain.geo import haversine_m
from ...domain.sampling import ALLOWED_INTERVALS_MI

MAX_DAYS_AHEAD = 14  # leaves room for the trip itself inside Open-Meteo's 16-day forecast
PAST_GRACE = timedelta(minutes=15)  # allow "leave now" even if the form sat open a while
MAX_LOAD_LB = 100_000
MIN_DISTANCE_M = 1_000
DEFAULT_INTERVAL_MI = 25


class PlaceSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lon = serializers.FloatField(min_value=-180, max_value=180)


class TripRequestSerializer(serializers.Serializer):
    origin = PlaceSerializer()
    destination = PlaceSerializer()
    departure = serializers.DateTimeField()
    load_lb = serializers.IntegerField(min_value=1, max_value=MAX_LOAD_LB)
    interval_mi = serializers.ChoiceField(choices=ALLOWED_INTERVALS_MI, default=DEFAULT_INTERVAL_MI)

    def validate_departure(self, value):
        now = timezone.now()
        if value < now - PAST_GRACE:
            raise serializers.ValidationError("Departure can't be in the past.")
        if value > now + timedelta(days=MAX_DAYS_AHEAD):
            raise serializers.ValidationError(f"Forecast is available up to {MAX_DAYS_AHEAD} days ahead.")
        return max(value, now).replace(microsecond=0).astimezone(dt_timezone.utc)  # a few minutes ago counts as "now"

    def validate(self, data):
        o, d = data["origin"], data["destination"]
        if haversine_m((o["lat"], o["lon"]), (d["lat"], d["lon"])) < MIN_DISTANCE_M:
            raise serializers.ValidationError({"destination": "Destination must be different from the origin."})
        return data
