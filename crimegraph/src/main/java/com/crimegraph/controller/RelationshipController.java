package com.crimegraph.controller;

import com.crimegraph.entity.Relationship;
import com.crimegraph.repository.RelationshipRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/relationships")
public class RelationshipController {

    private final RelationshipRepository relationshipRepository;

    public RelationshipController(RelationshipRepository relationshipRepository) {
        this.relationshipRepository = relationshipRepository;
    }

    @GetMapping
    public List<Relationship> getAllRelationships() {
        return relationshipRepository.findAll();
    }

    @PostMapping
    public Relationship createRelationship(@RequestBody Relationship relationship) {
        return relationshipRepository.save(relationship);
    }

    @GetMapping("/person/{personId}")
    public List<Relationship> getPersonRelationships(@PathVariable Long personId) {
        return relationshipRepository.findBySourcePersonIdOrTargetPersonId(
                personId, personId
        );
    }
}