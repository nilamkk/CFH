package codebuddy.backend.DTO;

import codebuddy.backend.document.ProblemDoc;
import java.util.List;
import java.util.UUID;

public class ProblemDetailsDTO {

    private String problemid;
    private Integer contestId;
    private String index;
    private String name;
    private String type;
    private String points;
    private List<String> tags;

    public ProblemDetailsDTO() {}

    public ProblemDetailsDTO(ProblemDoc problem) {
        this.problemid = problem.getId();
        this.contestId = problem.getContestId();
        this.index = problem.getIndex();
        this.name = problem.getName();
        this.type = problem.getType();
        this.points = problem.getPoints();
        this.tags = problem.getTags();
    }

    public String getProblemid() {
        return problemid;
    }

    public void setProblemid(String problemid) {
        this.problemid = problemid;
    }

    public Integer getContestId() {
        return contestId;
    }

    public void setContestId(Integer contestId) {
        this.contestId = contestId;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPoints() {
        return points;
    }

    public void setPoints(String points) {
        this.points = points;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
