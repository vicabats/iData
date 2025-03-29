package com.fatecipiranga.idata.api.response;

public class ProfessionalResponse {
    private String id;
    private String name;
    private String email;
    private String cpf;
    private String phone;
    private String birthdate;
    private String professionalLicense;
    private FacilityResponse facility;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getProfessionalLicense() {
        return professionalLicense;
    }

    public void setProfessionalLicense(String professionalLicense) {
        this.professionalLicense = professionalLicense;
    }

    public FacilityResponse getFacility() {
        return facility;
    }

    public void setFacility(FacilityResponse facility) {
        this.facility = facility;
    }
}