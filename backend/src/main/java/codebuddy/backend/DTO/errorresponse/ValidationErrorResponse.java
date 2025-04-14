package codebuddy.backend.DTO.errorresponse;


import java.util.Date;
import java.util.Map;

// Extended error response for validation errors
public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> fieldErrors;

    public ValidationErrorResponse(Date timestamp, int status, String error, String message, String path, Map<String, String> fieldErrors) {
        super(timestamp, status, error, message, path);
        this.fieldErrors = fieldErrors;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
