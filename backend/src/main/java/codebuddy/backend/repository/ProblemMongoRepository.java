package codebuddy.backend.repository;

import codebuddy.backend.document.ProblemDoc;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemMongoRepository extends MongoRepository<ProblemDoc, String> {
    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }")
    List<ProblemDoc> findByNameMatching(String namePattern); // Need to learn more about this
}
