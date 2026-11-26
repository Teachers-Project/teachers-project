package kr.teachers.record.saenggibu;

public class AiUnavailableException extends RuntimeException {
    public AiUnavailableException(String message) {
        super(message);
    }

    public AiUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
