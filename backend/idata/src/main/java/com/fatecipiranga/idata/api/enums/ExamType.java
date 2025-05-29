package com.fatecipiranga.idata.api.enums;

public enum ExamType {
    IMAGING("Imaging"),
    CLINICAL("Clinical"),
    DENTAL("Dental"),
    PHYSICAL("Physical"),
    OTHER("Other");

    private final String value;

    ExamType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ExamType fromValue(String value) {
        for (ExamType type : ExamType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid ExamType: " + value);
    }
}