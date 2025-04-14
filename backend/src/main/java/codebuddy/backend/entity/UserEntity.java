package codebuddy.backend.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="cb_users")
public class UserEntity {

    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    @GeneratedValue
    @Column( name = "userid", updatable = false, unique = true, nullable = false )
    private UUID userId;

    @Column( name = "handle", unique = false, nullable = false )
    private String handle;

    @Column( name = "name", unique = false, nullable = true )
    private String name;

    @Column( name = "email", unique = true, nullable = false )
    private String email;

    @Column( name = "password", unique = false, nullable = false )
    private String password;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
