package org.example.springboot_back.mastodon;

import org.example.springboot_back.services.MultipartInputStreamFileResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/mastodon")
public class MastodonController {

    private static final String CLIENT_ID = "mYk6vMW2968OZijo97RHvdWl_U9y7FCNizm_ge5jE7I";
    private static final String CLIENT_SECRET = "7JhLyAXmjBpIZ_BQy2MnfE19CJnro2RjGedNRekj-Lc";
    private static final String REDIRECT_URI = "http://localhost:8081/mastodon/callback";
    private static final String INSTANCE = "https://mastodon.social";

    private String accessToken;

    private final RestTemplate rest = new RestTemplate();

    // 1) Login URL
    @GetMapping("/login-url")
    public Map<String, String> getLoginUrl() {
        String authUrl = INSTANCE + "/oauth/authorize?" +
                "client_id=" + CLIENT_ID + "&" +
                "redirect_uri=" + REDIRECT_URI + "&" +
                "response_type=code&scope=write+read+follow";
        return Collections.singletonMap("authUrl", authUrl);
    }

    // 2) Callback
    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam String code) {
        String url = INSTANCE + "/oauth/token";

        Map<String, String> params = new HashMap<>();
        params.put("client_id", CLIENT_ID);
        params.put("client_secret", CLIENT_SECRET);
        params.put("redirect_uri", REDIRECT_URI);
        params.put("grant_type", "authorization_code");
        params.put("code", code);
        params.put("scope", "write read follow");

        ResponseEntity<Map> resp = rest.postForEntity(url, params, Map.class);
        if (resp.getBody() != null) {
            accessToken = (String) resp.getBody().get("access_token");
        }

        return ResponseEntity.ok("<script>window.close();</script>Login completato");
    }

    // 3) Post annuncio
    @PostMapping("/post")
    public ResponseEntity<?> post(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non autorizzato");
        }

        String text = "**" + title + "**\n" + description;
        String mediaId = null;

        // Carica media
        if (image != null && !image.isEmpty()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartInputStreamFileResource(image.getInputStream(), image.getOriginalFilename()));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> uploadResp = rest.postForEntity(INSTANCE + "/api/v1/media", requestEntity, Map.class);
            mediaId = (String) uploadResp.getBody().get("id");
        }

        // Pubblica stato
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("status", text);
        if (mediaId != null) {
            body.put("media_ids", Collections.singletonList(mediaId));
        }

        HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);

        ResponseEntity<Map> postResp = rest.postForEntity(INSTANCE + "/api/v1/statuses", req, Map.class);

        return ResponseEntity.ok(postResp.getBody());
    }

    // 4) Logout
    @GetMapping("/logout")
    public Map<String, Boolean> logout() {
        accessToken = null;
        return Collections.singletonMap("success", true);
    }
}