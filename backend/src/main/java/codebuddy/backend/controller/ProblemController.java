package codebuddy.backend.controller;

import codebuddy.backend.DTO.ProblemDetailsDTO;
import codebuddy.backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService){
        this.problemService = problemService;
    }

    /**
     * This router handles the addition of one problem to the database
     * POST /add-one-problem { contestId: 1, index: 'A', name: 'Two Sum', type: 'easy', points: '100', tags: ['array', 'hashmap'] }
     * Response: The problem added
     */
    @PostMapping(path="/add-one-problem")
    public ProblemDetailsDTO addOneProblem(@RequestBody ProblemDetailsDTO problem){
        return new ProblemDetailsDTO( this.problemService.addOneProblem(problem) );
    }

    /**
     * This router returns count of all problems from DB
     * GET /get-count-of-all-problems
     * Response: Count of problems
     */
    @GetMapping(path="/get-count-of-all-problems")
    public Integer getCountOfAllProblems(){
        return this.problemService.getCountOfAllProblems();
    }

    /**
     * This router handles the deletion of all problems from DB
     * DELETE /delete-all-problems
     * Response: Count of problems deleted
     */
    @DeleteMapping(path="/delete-all-problems")
    public Integer deleteAllProblems(){
        return this.problemService.deleteAllProblems();
    }

    /**
     * This router handles the fetching of all problems from name
     * GET /get-problem-by-name { name: 'problem name' }
     * Response: Array of all problems matching the name
     */
    @GetMapping(path="/get-problem-by-name")
    public List<ProblemDetailsDTO> getProblemByName(@RequestParam String name){
        return this.problemService
                .getProblemByName(name)
                .stream()
                .map(ProblemDetailsDTO::new)
                .toList();
    }

    /**
     * This router handles the addition of all problems from codeforces
     * POST /add-all-problems-from-codeforces
     * Response: Count of problems added
     */
    @PostMapping(path="/add-all-problems-from-codeforces")
    public Integer addAllProblemsFromCodeforces(){
        return this.problemService.addAllProblemsFromCodeforces();
    }
}
