package com.scrumchat.converter;

import com.scrumchat.model.MessageContent;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Converter(autoApply = true)
public class MessageContentConverter implements AttributeConverter<MessageContent, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(MessageContent attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting MessageContent to JSON", e);
        }
    }

    @Override
    public MessageContent convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, MessageContent.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting JSON to MessageContent", e);
        }
    }
}