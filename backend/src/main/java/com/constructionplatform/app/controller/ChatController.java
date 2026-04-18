package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.chat.ChatRequestDTO;
import com.constructionplatform.app.dto.chat.ChatResponseDTO;
import com.constructionplatform.app.service.ChatbotAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // Assuming React dev server runs here
public class ChatController {

    private final ChatbotAIService chatbotAIService;

    public ChatController(ChatbotAIService chatbotAIService) {
        this.chatbotAIService = chatbotAIService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        String aiResponse = chatbotAIService.generateChatResponse(request);
        return ResponseEntity.ok(new ChatResponseDTO(aiResponse));
    }
}
