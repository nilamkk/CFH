package codebuddy.backend.repository;


import codebuddy.backend.entity.UserDefinedCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<UserDefinedCategoryEntity, UUID> {
    List<UserDefinedCategoryEntity> findAllByUserUserId(UUID id);
}
