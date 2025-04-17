package org.unical.backend.exceptions;

public class NotImplementedException extends RuntimeException {
    public NotImplementedException(String details) {
        super("Not implement yet:\n\t" + details);
    }
    public NotImplementedException() {
        super("Not implement yet");
    }
}
