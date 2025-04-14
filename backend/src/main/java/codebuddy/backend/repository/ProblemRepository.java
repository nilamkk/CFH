package codebuddy.backend.repository;

import codebuddy.backend.entity.ProblemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<ProblemEntity, Integer> {
    List<ProblemEntity> findAllByCategoryCategoryid(UUID categoryid);
    List<ProblemEntity> findByUseridAndProblemid(UUID userid, UUID problemid);
    void deleteAllByUseridAndProblemid(UUID userid, UUID problemid);
    void deleteAllByUseridAndProblemidAndCategoryCategoryid(UUID userid, UUID problemid, UUID categoryid );
}