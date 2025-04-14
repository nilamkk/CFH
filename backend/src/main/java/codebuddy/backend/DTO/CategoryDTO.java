package codebuddy.backend.DTO;


import codebuddy.backend.entity.UserDefinedCategoryEntity;

import java.lang.reflect.Constructor;
import java.util.UUID;

public class CategoryDTO {
    private UUID categoryid;
    private String categorytitle;
    private UUID userid;

    public CategoryDTO(){

    }

    public CategoryDTO(UserDefinedCategoryEntity categoryEntity){
        this.categoryid = categoryEntity.getCategoryid();
        this.categorytitle = categoryEntity.getCategorytitle();
        this.userid = categoryEntity.getUser().getUserId();
    }

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

    public UUID getUserid() {
        return userid;
    }

    public void setUserid(UUID userid) {
        this.userid = userid;
    }
}
