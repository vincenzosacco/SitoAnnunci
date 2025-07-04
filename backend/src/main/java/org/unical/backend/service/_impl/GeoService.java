package org.unical.backend.service._impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.unical.backend.model.GeoLocation;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class GeoService {

    @Value("${google.maps.api.key}")
    private String API_KEY;

    public GeoLocation getCoordinates(String address) {
        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                + encodedAddress + "&key=" + API_KEY;

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);


            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode location = root.path("results")
                .get(0)
                .path("geometry")
                .path("location");

            double lat = location.path("lat").asDouble();
            double lng = location.path("lng").asDouble();

            return new GeoLocation(lat, lng);

        } catch (Exception e) {
            throw new RuntimeException("Errore durante il geocoding: " + e.getMessage());
        }
    }
}
