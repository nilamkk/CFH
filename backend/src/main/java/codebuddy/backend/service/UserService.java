package codebuddy.backend.service;

import codebuddy.backend.DTO.CFApiResponse;
import codebuddy.backend.DTO.CFResponseUserInfo;
import codebuddy.backend.DTO.SignupRequest;
import codebuddy.backend.DTO.UserDetailsDTO;
import codebuddy.backend.client.CodeForcesClient;
import codebuddy.backend.entity.UserEntity;
import codebuddy.backend.repository.UserRepository;
import codebuddy.backend.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.ArrayList;
import java.util.Map;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CodeForcesClient codeForcesClient;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, CodeForcesClient codeForcesClient){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.codeForcesClient = codeForcesClient;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username is email for us
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Add authorities/roles if needed
        );
    }

    public UserDetailsDTO registerUser(SignupRequest userDTO){
        // Check if username already exists
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) { /// /////////////////////////////
            throw new RuntimeException("Email already exists");
        }
        try{
            // Check if handle is valid
            CFResponseUserInfo cfResponseUserInfo = this.codeForcesClient.getUserInfo(userDTO.getHandle());
            if( cfResponseUserInfo.status().equalsIgnoreCase("FAILED") ){ // this never get executed. IDK why!
                throw new RuntimeException(cfResponseUserInfo.comment());
            }
        } catch (Exception e) {
            // the client throws exception based on status code
            throw new RuntimeException("Codeforces handle "+userDTO.getHandle()+" is not found");
        }

        // Create new user with encoded password
        UserEntity user = new UserEntity();
        user.setHandle(userDTO.getHandle());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());

        UserEntity savedUser = userRepository.save(user);

        // load user by username
        UserDetails userDetails = this.loadUserByUsername(user.getEmail());
        String jwt = this.jwtUtil.generateToken(userDetails);

        return new UserDetailsDTO(  savedUser.getUserId(), savedUser.getHandle(), savedUser.getName(),
                                    savedUser.getEmail(), null, jwt);
    }

    public UserDetailsDTO loginUser(UserDetailsDTO userDTO) throws Exception {
        final UserDetails userDetails = this.loadUserByUsername(userDTO.email());
        final String jwt = jwtUtil.generateToken(userDetails);

         UserEntity userEntity = this.userRepository.findByEmail(userDTO.email())
                 .orElseThrow(()-> new UsernameNotFoundException("User not found"));

        return new UserDetailsDTO( userEntity.getUserId(), userEntity.getHandle(), userEntity.getName(),
                userEntity.getEmail(), null, jwt);
    }

    public Map<String, String> getCFHandle(){
        UserEntity user = this.getAuthenticatedUser();
        return Map.of("handle", user.getHandle());
    }

    public UserEntity saveUser(UserEntity user){
        return this.userRepository.save(user);
    }

    // ***************************** Private Methods ***************************** //


    private UserEntity getAuthenticatedUser(){
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return this.userRepository.findByEmail(userEmail).orElseThrow(
                () -> new RuntimeException("User not found")
        );
    }


}
