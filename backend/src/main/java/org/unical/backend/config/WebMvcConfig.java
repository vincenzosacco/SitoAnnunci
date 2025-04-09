package org.unical.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static org.unical.utils.Urls.isValidUrl;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {
/**
 * This class is used to configure CORS (Cross-Origin Resource Sharing) for the Spring Boot application.
 * It is a 'Global' configuration, meaning it will apply to all controllers in the application.
 * https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html#mvc-cors-intro
 */

    @Value("${management.endpoints.web.cors.allowed-origins}") // get the value from application.properties
    private List<String> allowedUrlList;

    @PostConstruct // Need to be called after the constructor.
    public void init() {
        // Cannot be called in the constructor because the @Value annotation is not yet initialized.
        // VALIDATE THE URLS
        allowedUrlList.forEach(url -> {
            if (!isValidUrl(url)) {
                throw new IllegalArgumentException("Invalid url :" + url);
            }
        });
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // REGISTER CORS MAPPINGS
        registry.addMapping("/**")
                .allowedOrigins(String.join(",", allowedUrlList))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}
