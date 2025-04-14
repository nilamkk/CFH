package codebuddy.backend.controller;

import codebuddy.backend.DTO.CategoryDTO;
import codebuddy.backend.DTO.ProblemDTO;
import codebuddy.backend.DTO.ProblemDetailsDTO;
import codebuddy.backend.entity.ProblemEntity;
import codebuddy.backend.entity.UserDefinedCategoryEntity;
import codebuddy.backend.service.CategoryService;
import codebuddy.backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    /**
     * This router handles the addition of a new category for a user
     * POST /add-category { categorytitle: 'Dynamic Programming'} // user id is taken form security context
     * Response: Array of all categories of the user
     */
    @PostMapping(path="/add-category")
    public List<CategoryDTO> addCategory(@RequestBody CategoryDTO category){
        this.categoryService.saveCategory(category);
        // Return list of categories
        return this.categoryService
                .getAllCategoriesForUser( )
                .stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList() );
    }

    /**
     * This router handles the fetching of all categories of a user
     * GET /get-categories    // user id is taken form security context
     * Response: Array of all categories of the user
     */
    @GetMapping(path="/get-categories")
    public List<CategoryDTO> getCategoriesForUser( ){
        // Return list of categories
        return this.categoryService
                .getAllCategoriesForUser( )
                .stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList() );
    }

    /**
     * This router handles the deletion of a category
     * DELETE /delete-category { categoryid: 'categoryuuid' } // user id is taken form security context
     * Response: remaining categories
     */
    @DeleteMapping(path="/delete-category")
    public List<CategoryDTO> deleteCategory(@RequestBody CategoryDTO category){
        this.categoryService.deleteCategory(category.getCategoryid());
        // Return list of categories
        return this.categoryService
                .getAllCategoriesForUser( )
                .stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList() );
    }

    /**
     * This router handles the addition of a problem to a category
     * // user id is taken form security context
     * POST /add-problem-to-category { categoryid: 'categoryuuid', problemid: 'problemuuid', problemname: 'Two Sum', index: 'B' }
     * Response: added problem
     */
    @PostMapping(path="/add-problem-to-category")
    public ProblemDTO addProblemToCategory(@RequestBody ProblemDTO problem){
        return new ProblemDTO( this.categoryService.addProblem(problem) );
    }

    /**
     * This router handles the fetching of all problems of a category
     * GET /get-problems-from-category { categoryid: 'categoryuuid' }
     * Response: Array of all problems (with all properties) of the category
     */
    @GetMapping(path="/get-problems-from-category")
    public List<ProblemDetailsDTO> getProblemsFromCategory(@RequestParam UUID categoryid){
        return this.categoryService
                .getAllProblemsForCategory( categoryid )
                .stream()
                .map(ProblemDetailsDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * This router handles the fetching of the category of a problem for a user
     * GET /get-category-of-problem { problemid: 'problemuuid' } // user id is taken form security context
     * Response: List of Categories
     */
    @GetMapping(path="/get-category-of-problem")
    public List<CategoryDTO> getCategoryOfProblem(@RequestParam UUID problemid){
        return this.categoryService
                .getCategoryOfProblem(problemid)
                .stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * This router handles the deletion of a problem from category
     * DELETE /delete-problem-from-category { problemid: 'problemuuid' } // user id is taken form security context
     * Response: true/ false
     */
    @DeleteMapping(path="/delete-problem-for-user")
    public boolean deleteProblemForUser(@RequestBody ProblemDTO problem){
        this.categoryService.deleteProblemForUser( problem.getProblemid());
        return true;
    }

    /**
     * This router handles the deletion of a problem from a category for one user
     * DELETE /delete-problem-from-category { categoryid: categoryuuid, problemid: 'problemuuid'} // user id is taken form security context
     * Response: remaining problems of that category for this user
     */
    @DeleteMapping(path="/delete-problem-from-category")
    public List<ProblemDetailsDTO> deleteProblemFromCategory(@RequestBody ProblemDTO problem){
        this.categoryService.deleteProblemFromCategory(problem.getCategoryid(), problem.getProblemid());
        return this.categoryService
                .getAllProblemsForCategory( problem.getCategoryid() )
                .stream()
                .map(ProblemDetailsDTO::new)
                .collect(Collectors.toList());
    }
}
