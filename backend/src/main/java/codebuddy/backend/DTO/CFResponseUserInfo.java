package codebuddy.backend.DTO;

import java.util.List;

public record CFResponseUserInfo(String status, String comment, List<?> result) {
}
