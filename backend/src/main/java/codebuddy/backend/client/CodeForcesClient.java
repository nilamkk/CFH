package codebuddy.backend.client;

import codebuddy.backend.DTO.CFApiResponse;
import codebuddy.backend.DTO.CFResponseUserInfo;
import codebuddy.backend.DTO.ProblemDetailsDTO;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;
import java.util.Map;

@HttpExchange
public interface CodeForcesClient {
    @GetExchange("/problemset.problems")
    CFApiResponse getAllProblems();

    @GetExchange("/user.info?handles={handles}") // for multiple handles, use comma separated values
    CFResponseUserInfo getUserInfo(@RequestParam("handles") String handles);
}
