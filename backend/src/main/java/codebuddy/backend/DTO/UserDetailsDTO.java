package codebuddy.backend.DTO;

import java.util.UUID;

public record UserDetailsDTO(UUID userId, String handle, String name, String email, String password, String token) {
}
