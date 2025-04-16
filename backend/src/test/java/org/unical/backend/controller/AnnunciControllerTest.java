package org.unical.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * This class tests AnnunciController
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AnnunciControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    /**
     * Test
     */
    public void testGreetEndpoint() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/annunci"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}


