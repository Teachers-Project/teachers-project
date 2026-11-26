package kr.teachers.record.saenggibu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class SpellcheckService {

    static final String SYSTEM_PROMPT = """
            너는 한국어 맞춤법·띄어쓰기 검사기다. 교사가 쓴 학교생활기록부 문장에서
            맞춤법, 띄어쓰기, 오탈자 오류만 찾는다.
            규칙:
            1. 문체, 어휘, 어미, 문장 구조는 바꾸지 않는다. 생기부 문체(~함, ~임)는 올바른 표현이다.
            2. 명확한 오류만 알린다. 애매하면 알리지 않는다.
            3. 제안에 원문에 없는 사실, 단어, 숫자를 넣지 않는다.
            4. 학생 이름, 학교명 등 식별 정보를 만들어 넣지 않는다.
            5. 반드시 JSON 배열만 출력한다. 설명, 코드블록 표시는 쓰지 않는다.
               형식: [{"original":"본문에 있는 그대로의 틀린 부분","suggestion":"고친 표현","reason":"15자 이내 이유"}]
               original 은 본문에서 그대로 복사한 짧은 구간(단어~어절)이어야 한다.
            6. 오류가 없으면 [] 만 출력한다.
            """;

    private static final int MAX_ISSUES = 20;

    private final AiClient aiClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public SpellcheckService(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    public SpellcheckResponse check(SpellcheckRequest request) {
        if (!PolishService.ALLOWED_FIELDS.contains(request.field())) {
            throw new IllegalArgumentException("허용되지 않은 영역입니다: " + request.field());
        }
        List<String> found = StudentInfoGuard.findStudentInfo(request.text());
        if (!found.isEmpty()) {
            throw new StudentInfoDetectedException(found);
        }
        String raw = aiClient.polish(SYSTEM_PROMPT, request.text());
        return new SpellcheckResponse(parseAndFilter(request.text(), raw));
    }

    /** AI 응답을 읽고, 본문과 맞지 않거나 사실을 더하는 제안은 버린다. */
    List<SpellcheckResponse.Issue> parseAndFilter(String text, String raw) {
        JsonNode root;
        try {
            root = mapper.readTree(stripFence(raw));
        } catch (Exception e) {
            throw new AiUnavailableException("맞춤법 검사 결과를 읽지 못했습니다. 다시 시도해 주세요.", e);
        }
        if (root == null || !root.isArray()) {
            throw new AiUnavailableException("맞춤법 검사 결과를 읽지 못했습니다. 다시 시도해 주세요.");
        }
        List<SpellcheckResponse.Issue> issues = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (JsonNode n : root) {
            String original = n.path("original").asText("").trim();
            String suggestion = n.path("suggestion").asText("").trim();
            String reason = n.path("reason").asText("").trim();
            if (original.isEmpty() || suggestion.isEmpty() || original.equals(suggestion)) {
                continue;
            }
            if (!text.contains(original)) {
                continue;
            }
            if (!PolishService.findAddedFacts(original, suggestion).isEmpty()) {
                continue;
            }
            if (!StudentInfoGuard.findStudentInfo(suggestion).isEmpty()) {
                continue;
            }
            if (!seen.add(original + "\u0000" + suggestion)) {
                continue;
            }
            issues.add(new SpellcheckResponse.Issue(original, suggestion, reason));
            if (issues.size() >= MAX_ISSUES) {
                break;
            }
        }
        return issues;
    }

    private static String stripFence(String raw) {
        String s = raw == null ? "" : raw.trim();
        if (s.startsWith("```")) {
            int nl = s.indexOf('\n');
            s = nl >= 0 ? s.substring(nl + 1) : s.substring(3);
            if (s.endsWith("```")) {
                s = s.substring(0, s.length() - 3);
            }
        }
        return s.trim();
    }
}
