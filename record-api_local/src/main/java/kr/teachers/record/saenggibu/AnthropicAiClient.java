package kr.teachers.record.saenggibu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Anthropic Messages API 호출. API 키가 없으면 비활성 상태로 두고 503 을 돌려줍니다.
 * 모델 이름은 설정으로 바꿉니다. 실제 모델 선택은 아직 확정되지 않았습니다.
 */
@Component
public class AnthropicAiClient implements AiClient {

    private static final URI ENDPOINT = URI.create("https://api.anthropic.com/v1/messages");

    private final String apiKey;
    private final String model;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final ObjectMapper mapper = new ObjectMapper();

    public AnthropicAiClient(
            @Value("${saenggibu.ai.api-key:}") String apiKey,
            @Value("${saenggibu.ai.model:}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public String polish(String systemPrompt, String userText) {
        if (apiKey == null || apiKey.isBlank() || model == null || model.isBlank()) {
            throw new AiUnavailableException("AI 설정(API 키, 모델)이 없어 다듬기를 사용할 수 없습니다.");
        }
        try {
            ObjectNode body = mapper.createObjectNode();
            body.put("model", model);
            body.put("max_tokens", 512);
            body.put("system", systemPrompt);
            ArrayNode messages = body.putArray("messages");
            ObjectNode user = messages.addObject();
            user.put("role", "user");
            user.put("content", userText);

            HttpRequest req = HttpRequest.newBuilder(ENDPOINT)
                    .timeout(Duration.ofSeconds(30))
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() != 200) {
                throw new AiUnavailableException("AI 호출이 실패했습니다 (HTTP " + res.statusCode() + ").");
            }
            JsonNode root = mapper.readTree(res.body());
            JsonNode first = root.path("content").path(0).path("text");
            if (first.isMissingNode() || first.asText().isBlank()) {
                throw new AiUnavailableException("AI 응답이 비어 있습니다.");
            }
            return first.asText().trim();
        } catch (IOException e) {
            throw new AiUnavailableException("AI 호출 중 네트워크 오류가 났습니다.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AiUnavailableException("AI 호출이 중단되었습니다.", e);
        }
    }
}
