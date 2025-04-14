package codebuddy.backend.DTO;

import codebuddy.backend.entity.ProblemEntity;

import java.util.UUID;

public class ProblemDTO {
    private Integer id;
    private UUID problemid;
    private String problemname;
    private UUID userid;
    private UUID categoryid;

    public ProblemDTO(){}

    public ProblemDTO(ProblemEntity problemEntity){
        this.id = problemEntity.getId();
        this.problemid = problemEntity.getProblemid();
        this.problemname = problemEntity.getProblemname();
        this.userid = problemEntity.getUserid();
        this.categoryid = problemEntity.getCategory().getCategoryid();
    }

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

    public UUID getCategoryid() {
        return categoryid;
    }

    public void setCategoryid(UUID categoryid) {
        this.categoryid = categoryid;
    }
}
