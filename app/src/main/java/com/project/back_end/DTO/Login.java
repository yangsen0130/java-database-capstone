package com.project.back_end.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;

public class Login {

    // @JsonAlias 允许前端传 "email" 或 "username"，都会自动映射到这个 identifier 字段
    @JsonAlias({"email", "username"}) 
    private String identifier; 

    private String password;

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}