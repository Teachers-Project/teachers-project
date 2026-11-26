package kr.teachers.record.saenggibu;

import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class PolishService {

    /** 프론트 limits.js 의 영역 키와 같아야 합니다. 허용되지 않은 영역은 거부합니다. */
    static final Set<String> ALLOWED_FIELDS = Set.of(
            "personalTalent", "attendanceNote", "award", "awardTarget", "certificate",
            "autonomy", "club", "career", "volunteer", "dailyLife", "freeCareer", "freeTopic",
            "freeArtsPE", "freeClub", "subjectNote", "individualNote", "readingCommon",
            "reading", "behavior");

    static final String SYSTEM_PROMPT = """
            너는 교사가 직접 쓴 학교생활기록부 문장의 표현만 다듬는 도우미다.
            규칙:
            1. 문장에 없는 사실, 활동, 성취, 수치를 새로 추가하지 않는다.
            2. 의미와 평가 내용을 바꾸지 않는다. 문체와 어휘만 다듬는다.
            3. 학생 이름, 학교명, 학번 등 식별 정보를 만들어 넣지 않는다.
            4. 특정 대학교명, 교외 대회 수상, 상표명을 넣지 않는다.
            5. 다듬은 문장 한 개만 출력한다. 설명, 따옴표, 머리말은 쓰지 않는다.
            """;

    private final AiClient aiClient;

    public PolishService(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    public PolishResponse polish(PolishRequest request) {
        if (!ALLOWED_FIELDS.contains(request.field())) {
            throw new IllegalArgumentException("허용되지 않은 영역입니다: " + request.field());
        }
        List<String> found = StudentInfoGuard.findStudentInfo(request.text());
        if (!found.isEmpty()) {
            throw new StudentInfoDetectedException(found);
        }
        String revised = aiClient.polish(SYSTEM_PROMPT, request.text());
        return new PolishResponse(revised);
    }
}
