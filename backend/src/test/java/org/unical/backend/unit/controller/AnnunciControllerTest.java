package org.unical.backend.unit.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.unical.backend.controller.AnnunciController;
import org.unical.backend.model.Annuncio;
import org.unical.backend.service.IAnnuncioService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(value=AnnunciController.class)
@ActiveProfiles("test")
public class AnnunciControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private IAnnuncioService mockService;

    /**
     * Test if method {@link org.unical.backend.controller.AnnunciController#getAllAnnunci()} returns the expected value.
     * The expected value is a list of 4 annunci.
     * @throws Exception if `mockMvc.perform()` throws an exception.
     */
    @Test
    public void getAllAnnunci_returnExpected() throws Exception {
        // GIVEN
        List<Annuncio> allAnnunci = List.of(
                new Annuncio(0, "Titolo", "Descrizione", "100"),
                new Annuncio(1, "Titolo2", "Descrizione2", "200"),
                new Annuncio(2, "Titolo3", "Descrizione3", "300"),
                new Annuncio(3, "Titolo4", "Descrizione4", "400")
        );
        given(mockService.findAll()).willReturn(allAnnunci);

        // WHEN
        String responseJson = mockMvc.perform(get("/annunci")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // THEN
        List<Annuncio> responseAnnunci = objectMapper.readValue(
                responseJson,
                new TypeReference<List<Annuncio>>() {}
        );

        assertThat(responseAnnunci).containsExactlyElementsOf(allAnnunci);
    }

    @Test
    public void getAnnuncioById_returnExpected() throws Exception {
        // GIVEN
        Annuncio ann = new Annuncio(0, "Titolo", "Descrizione", "100");
        given(mockService.findById(0)).willReturn(ann);

        // WHEN
        String responseJson = mockMvc.perform(get("/annunci/0"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // THEN
        Annuncio responseAnnuncio = objectMapper.readValue(responseJson, Annuncio.class);

        assertThat(responseAnnuncio).isEqualTo(ann);
    }




}
