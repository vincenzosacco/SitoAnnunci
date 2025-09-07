package org.example.springboot_back.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Data {
    private int id;
    private String titolo;
    private String descrizione;
    private int superficie;
    private String indirizzo;
    private Integer categoriaId;
    private String categoriaTipo;
    private Integer venditoreId;
    private LocalDateTime dataCreazione;
    private Double longitudine;
    private Double latitudine;
    private BigDecimal prezzoNuovo;
    private BigDecimal prezzoVecchio;
    private Boolean inVendita;
    private String immagineBase64;

    public Data() {}

    public Data(int id, String titolo, String descrizione, int superficie,
                String indirizzo, Integer categoriaId, String categoriaTipo,
                Integer venditoreId, LocalDateTime dataCreazione,
                Double longitudine, Double latitudine,
                BigDecimal prezzoNuovo, BigDecimal prezzoVecchio,
                Boolean inVendita) {
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.superficie = superficie;
        this.indirizzo = indirizzo;
        this.categoriaId = categoriaId;
        this.categoriaTipo = categoriaTipo;
        this.venditoreId = venditoreId;
        this.dataCreazione = dataCreazione;
        this.longitudine = longitudine;
        this.latitudine = latitudine;
        this.prezzoNuovo = prezzoNuovo;
        this.prezzoVecchio = prezzoVecchio;
        this.inVendita = inVendita;
    }

    // --- getters / setters ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitolo() { return titolo; }
    public void setTitolo(String titolo) { this.titolo = titolo; }

    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }

    public int getSuperficie() { return superficie; }
    public void setSuperficie(int superficie) { this.superficie = superficie; }

    public String getIndirizzo() { return indirizzo; }
    public void setIndirizzo(String indirizzo) { this.indirizzo = indirizzo; }

    public Integer getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }

    public String getCategoriaTipo() { return categoriaTipo; }
    public void setCategoriaTipo(String categoriaTipo) { this.categoriaTipo = categoriaTipo; }

    public Integer getVenditoreId() { return venditoreId; }
    public void setVenditoreId(Integer venditoreId) { this.venditoreId = venditoreId; }

    public LocalDateTime getDataCreazione() { return dataCreazione; }
    public void setDataCreazione(LocalDateTime dataCreazione) { this.dataCreazione = dataCreazione; }

    public Double getLongitudine() { return longitudine; }
    public void setLongitudine(Double longitudine) { this.longitudine = longitudine; }

    public Double getLatitudine() { return latitudine; }
    public void setLatitudine(Double latitudine) { this.latitudine = latitudine; }

    public BigDecimal getPrezzoNuovo() { return prezzoNuovo; }
    public void setPrezzoNuovo(BigDecimal prezzoNuovo) { this.prezzoNuovo = prezzoNuovo; }

    public BigDecimal getPrezzoVecchio() { return prezzoVecchio; }
    public void setPrezzoVecchio(BigDecimal prezzoVecchio) { this.prezzoVecchio = prezzoVecchio; }

    public Boolean getInVendita() { return inVendita; }
    public void setInVendita(Boolean inVendita) { this.inVendita = inVendita; }

    public String getImmagineBase64() { return immagineBase64; }
    public void setImmagineBase64(String immagineBase64) { this.immagineBase64 = immagineBase64; }

    @Override
    public String toString() {
        return "Data{" +
                "id=" + id +
                ", titolo='" + titolo + '\'' +
                ", descrizione='" + descrizione + '\'' +
                ", superficie=" + superficie +
                ", indirizzo='" + indirizzo + '\'' +
                ", categoriaId=" + categoriaId +
                ", categoriaTipo='" + categoriaTipo + '\'' +
                ", venditoreId=" + venditoreId +
                ", dataCreazione=" + dataCreazione +
                ", longitudine=" + longitudine +
                ", latitudine=" + latitudine +
                ", prezzoNuovo=" + prezzoNuovo +
                ", prezzoVecchio=" + prezzoVecchio +
                ", inVendita=" + inVendita +
                '}';
    }
}