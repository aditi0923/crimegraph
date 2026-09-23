package com.crimegraph.controller;

import com.crimegraph.entity.Case;
import com.crimegraph.repository.CaseRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "http://localhost:5173")
public class CaseController {

    private final CaseRepository caseRepository;

    public CaseController(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    @GetMapping
    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    @PostMapping
    public Case createCase(@RequestBody Case newCase) {
        return caseRepository.save(newCase);
    }
    @DeleteMapping("/{id}")
public void deleteCase(@PathVariable Long id) {
    caseRepository.deleteById(id);
}
}