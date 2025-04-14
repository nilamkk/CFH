package codebuddy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="cb_user_defined_category")
public class UserDefinedCategoryEntity {

    @Id
    // @GeneratedValue(strategy = GenerationType.UUID) // JPA will generate the UUID for us
    // but for us PG is already doing this so we can skip UUID generation by JPA
    @GeneratedValue // Just fetch the UUID after generation in PG DB
    @Column(name="categoryid", updatable = false, unique = true, nullable = false  )
    private UUID categoryid;

    @Column(name="categorytitle", unique = false, nullable = false  )
    private String categorytitle;

    // If I allow cascade delete here then it will delete the user entity on deletion of Category
    // So with this approach, I can't cascade from JPA but DB will take care of this.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userid", referencedColumnName = "userId" )
    @JsonIgnore
    private UserEntity user;

    public UUID getCategoryid() {
        return categoryid;
    }

    public void setCategoryid(UUID categoryid) {
        this.categoryid = categoryid;
    }

    public String getCategorytitle() {
        return categorytitle;
    }

    public void setCategorytitle(String categorytitle) {
        this.categorytitle = categorytitle;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
