package codebuddy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cb_category_problem_rel")
public class ProblemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // let database handle the id generation
    @Column(name = "id", unique = true, nullable = false)
    private Integer id;

    @Column(name = "problemid", nullable = false)
    private UUID problemid;

    @Column(name = "problemname", nullable = false)
    private String problemname;

    @Column(name = "userid", nullable = false)
    private UUID userid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryid", referencedColumnName = "categoryid")
    @JsonIgnore
    private UserDefinedCategoryEntity category;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public UUID getProblemid() {
        return problemid;
    }

    public void setProblemid(UUID problemid) {
        this.problemid = problemid;
    }

    public String getProblemname() {
        return problemname;
    }

    public void setProblemname(String problemname) {
        this.problemname = problemname;
    }

    public UUID getUserid() {
        return userid;
    }

    public void setUserid(UUID userid) {
        this.userid = userid;
    }

    public UserDefinedCategoryEntity getCategory() {
        return category;
    }

    public void setCategory(UserDefinedCategoryEntity category) {
        this.category = category;
    }
}
