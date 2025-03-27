package com.fatecipiranga.idata.api;

import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.LoginResponse;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.business.ProfessionalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfessionalController {

    private final ProfessionalService professionalService;

    public ProfessionalController(ProfessionalService professionalService) {
        this.professionalService = professionalService;
    }

    @PostMapping(params = "type=professional")
    public ResponseEntity<ProfessionalResponse> createProfessional(@RequestBody ProfessionalDTO professionalDTO) {
        ProfessionalResponse createdProfessional = professionalService.createProfessional(professionalDTO);
        return new ResponseEntity<>(createdProfessional, HttpStatus.CREATED);
    }

    @PostMapping(value = "/login", params = "type=professional")
    public ResponseEntity<LoginResponse<ProfessionalResponse>> login(@RequestBody LoginDTO loginDTO) {
        ProfessionalResponse professional = professionalService.login(loginDTO);
        String token = UUID.randomUUID().toString();
        LoginResponse<ProfessionalResponse> response = new LoginResponse<>(professional, token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}