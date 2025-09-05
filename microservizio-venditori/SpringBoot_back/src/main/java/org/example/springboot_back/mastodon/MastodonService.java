package org.example.springboot_back.mastodon;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Service
public class MastodonService {

    private final MastodonConfig config;
    private final RestTemplate restTemplate;

    // In-memory token (in un'app reale salvalo in DB o sessione)
    private String accessToken;

    public MastodonService(MastodonConfig config) {
        this.config = config;
        this.restTemplate = new RestTemplate();
    }

    public String getAuthorizationUrl() {
        return String.format("%s/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=write+read+follow",
                config.getInstanceUrl(), config.getClientId(), config.getRedirectUri());
    }

    public void exchangeCodeForToken(String code) {
        String url = config.getInstanceUrl() + "/oauth/token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", config.getClientId());
        params.add("client_secret", config.getClientSecret());
        params.add("redirect_uri", config.getRedirectUri());
        params.add("grant_type", "authorization_code");
        params.add("code", code);
        params.add("scope", "write read follow");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if(response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            accessToken = (String) response.getBody().get("access_token");
        } else {
            throw new RuntimeException("Errore nel token exchange Mastodon");
        }
    }

    public String getAccessToken() {
        return accessToken;
    }

    public Map uploadMedia(MultipartFile file) throws IOException {
        String url = config.getInstanceUrl() + "/api/v1/media";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Errore caricamento media Mastodon");
        }
    }

    public Map postStatus(String status, String mediaId) {
        String url = config.getInstanceUrl() + "/api/v1/statuses";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String jsonBody = mediaId != null
                ? String.format("{\"status\":\"%s\",\"media_ids\":[\"%s\"]}", status, mediaId)
                : String.format("{\"status\":\"%s\"}", status);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if(response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Errore posting status Mastodon");
        }
    }

    public void logout() {
        this.accessToken = null;
    }
}