package codebuddy.backend.service;

import codebuddy.backend.DTO.CategoryDTO;
import codebuddy.backend.DTO.ProblemDTO;
import codebuddy.backend.document.ProblemDoc;
import codebuddy.backend.entity.ProblemEntity;
import codebuddy.backend.entity.UserDefinedCategoryEntity;
import codebuddy.backend.entity.UserEntity;
import codebuddy.backend.repository.CategoryRepository;
import codebuddy.backend.repository.ProblemMongoRepository;
import codebuddy.backend.repository.ProblemRepository;
import codebuddy.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ProblemMongoRepository problemMongoRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository,
                           ProblemRepository problemRepository, ProblemMongoRepository problemMongoRepository){
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.problemMongoRepository = problemMongoRepository;
    }

    public UserDefinedCategoryEntity saveCategory(CategoryDTO category){
        UserEntity userEntity = this.getAuthenticatedUser();
        UserDefinedCategoryEntity categoryEntity = new UserDefinedCategoryEntity();
        categoryEntity.setCategorytitle( category.getCategorytitle() );
        // set foreign key - userid
//        UserEntity user =  this.userRepository.getReferenceById( category.getUserid() );
        categoryEntity.setUser( userEntity );
        return this.categoryRepository.save(categoryEntity);
    }

    public List<UserDefinedCategoryEntity> getAllCategoriesForUser( ){
        UserEntity userEntity = this.getAuthenticatedUser();
        return this.categoryRepository.findAllByUserUserId( userEntity.getUserId() );
    }

    public void deleteCategory(UUID categoryUUID){
        this.categoryRepository.delete(this.categoryRepository.getReferenceById(categoryUUID));
    }

    public ProblemEntity addProblem(ProblemDTO problem){
        UserEntity userEntity = this.getAuthenticatedUser();

        ProblemEntity problemEntity = new ProblemEntity();
        problemEntity.setProblemid( problem.getProblemid() );
        problemEntity.setProblemname( problem.getProblemname() );
        problemEntity.setUserid(userEntity.getUserId());  //( problem.getUserid() );
        problemEntity.setCategory( this.categoryRepository.getReferenceById( problem.getCategoryid() ) );

        return this.problemRepository.save( problemEntity );
    }

    public List<ProblemDoc> getAllProblemsForCategory(UUID categoryid){
        List<ProblemEntity> problemEntities = this.problemRepository.findAllByCategoryCategoryid( categoryid );
        return this.problemMongoRepository.findAllById(
                problemEntities.stream()
                        .map( problemEntity -> problemEntity.getProblemid().toString() )
                        .collect(Collectors.toList())
        );
    }

    public Set<UserDefinedCategoryEntity> getCategoryOfProblem(UUID problemid){
        UserEntity userEntity = this.getAuthenticatedUser();
        List<ProblemEntity> problemRelations = this.problemRepository.findByUseridAndProblemid(userEntity.getUserId(), problemid);
        return problemRelations.stream()
                .map(ProblemEntity::getCategory)
                .collect(Collectors.toSet());
    }

    @Transactional
    public void deleteProblemForUser(UUID problemid){
        UserEntity userEntity = this.getAuthenticatedUser();
        this.problemRepository.deleteAllByUseridAndProblemid(userEntity.getUserId(), problemid);
    }

    @Transactional
    public void deleteProblemFromCategory(UUID categoryid, UUID problemid){
        UserEntity userEntity = this.getAuthenticatedUser();
        this.problemRepository.deleteAllByUseridAndProblemidAndCategoryCategoryid(userEntity.getUserId(), problemid, categoryid);
    }


    // ***************************** Private Methods ***************************** //


    private UserEntity getAuthenticatedUser(){
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return this.userRepository.findByEmail(userEmail).orElseThrow(
                () -> new RuntimeException("User not found")
        );
    }

}
