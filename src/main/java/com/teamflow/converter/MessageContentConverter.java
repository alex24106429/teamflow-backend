package com.teamflow.converter;

import com.teamflow.model.MessageContent;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MessageContentConverter implements AttributeConverter<MessageContent, String> {

    @Override
    public String convertToDatabaseColumn(MessageContent attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getContent();
    }

    @Override
    public MessageContent convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return new MessageContent(dbData);
    }
}