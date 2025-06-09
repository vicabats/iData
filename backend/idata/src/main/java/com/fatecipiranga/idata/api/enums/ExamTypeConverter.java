package com.fatecipiranga.idata.api.enums;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;

@ReadingConverter
public class ExamTypeConverter implements Converter<String, ExamType> {
    @Override
    public ExamType convert(String source) {
        if (source == null) {
            return null;
        }
        if ("BLOOD_TEST".equalsIgnoreCase(source)) {
            return ExamType.CLINICAL;
        }
        try {
            return ExamType.fromValue(source);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ExamType value: " + source, e);
        }
    }
}