package codebuddy.backend.controller;

import codebuddy.backend.DTO.SignupRequest;
import codebuddy.backend.DTO.UserDetailsDTO;
import codebuddy.backend.entity.UserEntity;
import codebuddy.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public UserController(UserService userService, AuthenticationManager authenticationManager){
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * This router handles user sign up
     * POST /signup { handle: 'Handle1', email: 'john1.doe@example.com', password: 'password' }
     * Response: created user with token
     */
    @PostMapping(path = "/signup")
    public ResponseEntity<?> handleUserSignup(@Valid @RequestBody SignupRequest userInfo){
        return ResponseEntity.ok(this.userService.registerUser(userInfo));
    }

    /**
     * This router handles user log in
     * POST /login { email: 'john1.doe@example.com', password: 'password' }
     * Response: user with token
     */
    @PostMapping(path = "/login")
    public Map<String, UserDetailsDTO> handleUserLogin(@RequestBody UserDetailsDTO user) throws Exception { /// ///////////////
        try { // we can't write thing in userService as that will cause circular dependency
            this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.email(),
                            user.password()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect email or password", e);
        }
        return Map.of("user", this.userService.loginUser(user));
    }

    /**
     * This router returns CF handle for authenticated user
     * GET /cfhandle with token in the header
     * Response: {handle: 'cfhandle'}
     */
    @GetMapping(path = "/cfhandle")
    public Map<String, String> handleGetCFHandle( ){
        return this.userService.getCFHandle();
    }

    /**
     * This router tests the authentication
     * GET /helloWorld token in the header
     * Response: "Hello World! You are authenticated!"
     */
    @GetMapping(path = "/helloWorld")
    public String handleAuthTest( ){
        return "Hello World! You are authenticated!";
    }

    /**
     * This router handles the creation of a new user
     * POST /create-user { handle: 'Handle1', name: 'John Doe', email: 'john1.doe@example.com' }
     * Response: created user
     */
    @PostMapping(path = "/create-user")
    public UserEntity createUser(@RequestBody UserEntity user){
        return null; //this.userService.saveUser(user);
    }
}
