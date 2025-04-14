package codebuddy.backend.document;

import codebuddy.backend.DTO.ProblemDetailsDTO;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;
import java.util.UUID;

@Document(collection = "problems")
public class ProblemDoc {
    @MongoId(targetType = FieldType.STRING) // automatic generation of UUID
    private String id;

    @Field(name = "contestId")
    private Integer contestId;

    @Field(name = "index")
    private String index;

    @Field(name = "name")
    private String name;

    @Field(name = "type")
    private String type;

    @Field(name = "points")
    private String points;

    @Field(name = "tags")
    private List<String> tags;


    public ProblemDoc(){
        this.id = UUID.randomUUID().toString();
    }

    public ProblemDoc(ProblemDetailsDTO problemDetailsDTO){
        this.id = UUID.randomUUID().toString();
        this.contestId = problemDetailsDTO.getContestId();
        this.index = problemDetailsDTO.getIndex();
        this.name = problemDetailsDTO.getName();
        this.type = problemDetailsDTO.getType();
        this.points = problemDetailsDTO.getPoints();
        this.tags = problemDetailsDTO.getTags();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getContestId() {
        return contestId;
    }

    public void setContestId(Integer contestId) {
        this.contestId = contestId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
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
