package org.example.springboot_back.mastodon;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/mastodon")
public class MastodonController {

    private final MastodonService mastodonService;

    public MastodonController(MastodonService mastodonService) {
        this.mastodonService = mastodonService;
    }

    @GetMapping("/authorize-url")
    public ResponseEntity<String> getAuthorizationUrl() {
        return ResponseEntity.ok(mastodonService.getAuthorizationUrl());
    }

    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam String code) {
        try {
            mastodonService.exchangeCodeForToken(code);
            return ResponseEntity.ok("Token ottenuto con successo");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Errore durante il token exchange: " + e.getMessage());
        }
    }

    @PostMapping("/post")
    public ResponseEntity<?> postStatus(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) {

        if (mastodonService.getAccessToken() == null) {
            return ResponseEntity.status(401).body("Non autorizzato");
        }

        try {
            String statusText = "**" + title + "**\n" + description;
            String mediaId = null;

            if (image != null && !image.isEmpty()) {
                Map mediaResp = mastodonService.uploadMedia(image);
                mediaId = mediaResp.get("id").toString();
            }

            Map postResp = mastodonService.postStatus(statusText, mediaId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "url", postResp.get("url")
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Errore durante il caricamento immagine: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Errore durante il post: " + e.getMessage());
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout() {
        mastodonService.logout();
        return ResponseEntity.ok("Logout eseguito");
    }
}