package com.scrumchat.model;

public class MessageContent {
    private String content;

    public MessageContent() {}

    public MessageContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}