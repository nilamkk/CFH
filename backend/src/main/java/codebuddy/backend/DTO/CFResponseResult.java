package codebuddy.backend.DTO;

import java.util.List;

// Ignoring the other part of the result (problemStatistics) as it is not needed
public record CFResponseResult(List<ProblemDetailsDTO> problems) {
}
