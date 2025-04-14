package codebuddy.backend.repository;

import codebuddy.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// JPARepository is for blocking CRUD
// For reactive crud use Interface ReactiveCrudRepository<T,ID>
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
}
